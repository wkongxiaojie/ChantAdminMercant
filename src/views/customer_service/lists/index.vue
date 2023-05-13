<template>
    <div class="CustomerService">
        <el-card class="!border-none" shadow="never">
            <el-form class="mb-[-16px]" :model="formData" inline>
                <el-form-item label="客服账号">
                    <el-input
                        v-model="formData.account"
                        class="w-[280px]"
                        clearable
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item label="客服手机号">
                    <el-input
                        v-model="formData.mobile"
                        class="w-[280px]"
                        clearable
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item label="客服昵称">
                    <el-input
                        v-model="formData.nickname"
                        class="w-[280px]"
                        clearable
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select class="w-[280px]" v-model="formData.is_disable">
                        <el-option label="启用" value="0" />
                        <el-option label="禁用" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                    <export-data
                        class="ml-2.5"
                        :fetch-fun="CustomerServiceLists"
                        :params="formData"
                        :page-size="pager.size"
                    />
                </el-form-item>
            </el-form>
        </el-card>
        <el-card v-loading="pager.loading" class="mt-4 !border-none" shadow="never">
            <el-button type="primary" @click="handleAdd">
                <template #icon>
                    <icon name="el-icon-Plus" />
                </template>
                新增
            </el-button>
            <el-button type="primary" @click="handlePdel">
                <template #icon>
                    <icon name="el-icon-Plus" />
                </template>
                删除
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" size="large" @selection-change="handleSelection">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="ID" prop="id" min-width="60" />
                    <el-table-column label="头像" min-width="100">
                        <template #default="{ row }">
                            <el-avatar :size="50" :src="row.avatar"></el-avatar>
                        </template>
                    </el-table-column>
                    <el-table-column label="账号" prop="account" min-width="80" />
                    <el-table-column label="手机号" prop="mobile" min-width="110" />
                    <el-table-column label="最近登录时间" prop="login_time" min-width="120" />
                    <el-table-column label="最近登录IP" prop="login_ip" min-width="100" />

                    <el-table-column label="状态" min-width="80">
                        <template #default="{ row }">
                            <el-switch
                                v-model="row.is_disable"
                                :active-value="0"
                                size="large"
                                inline-prompt
                                active-text="启用"
                                :inactive-value="1"
                                inactive-text="禁用"
                                @change="changeStatus(row)"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="create_time" min-width="120" />
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">
                            <el-button type="primary" link @click="handleEdit(row)">
                                编辑
                            </el-button>
                            <el-button type="danger" link @click="handleDelete(row.id)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
        <edit-popup v-if="showEdit" ref="editRef" @success="getLists" @close="showEdit = false" />
    </div>
</template>

<script lang="ts" setup name="CustomerService">
import {
    CustomerServiceEdit,
    CustomerServiceLists,
    CustomerServiceDelete
} from '@/api/customer_service'

import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

interface CustomerService {
    id: string
    mobile: string
    cid: string
    nickname: string
}

const multipleSelection = ref([])

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 表单数据
const formData = reactive({
    is_disable: '',
    mobile: '',
    nickname: '',
    account: ''
})
const showEdit = ref(false)
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: CustomerServiceLists,
    params: formData
})

//获取选中项
const handleSelection = (rows: CustomerService[]) => {
    multipleSelection.value = []
    rows.forEach((v) => {
        multipleSelection.value.push(v.id as never)
    })
    multipleSelection.value = Object.values(multipleSelection.value)
}
const changeStatus = (data: any) => {
    CustomerServiceEdit({
        id: data.id,
        mobile: data.mobile,
        nickname: data.nickname,
        real_name: data.real_name,
        is_disable: data.is_disable
    }).finally(() => {
        getLists()
    })
}
const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('add')
}
const handlePdel = async () => {
    await feedback.confirm('确定要删除？')
    await handleDelete(multipleSelection.value as any)
    await getLists()
}
const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('edit')
    editRef.value?.setFormData(data)
}

const handleDelete = async (id: number) => {
    await feedback.confirm('确定要删除？')
    await CustomerServiceDelete({ id }).finally(() => {
        getLists()
    })
}

onMounted(() => {
    getLists()
})
</script>
