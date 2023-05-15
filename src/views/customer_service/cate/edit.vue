<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="popupTitle"
            :async="true"
            width="550px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" :model="formData" label-width="80px" :rules="formRules">
                <el-form-item label="父级菜单" prop="pid">
                    <el-tree-select
                        class="flex-1"
                        v-model="formData.pid"
                        :data="menuOptions"
                        clearable
                        node-key="id"
                        :props="{
                            label: 'name'
                        }"
                        :default-expand-all="true"
                        placeholder="请选择父级菜单"
                        check-strictly
                    />
                </el-form-item>
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入分类" clearable />
                </el-form-item>
                <el-form-item label="是否显示" prop="is_show" required>
                    <div>
                        <el-radio-group v-model="formData.is_show">
                            <el-radio :label="1">显示</el-radio>
                            <el-radio :label="0">隐藏</el-radio>
                        </el-radio-group>
                        <div class="form-tips">
                            选择隐藏则路由将不会出现在侧边栏，但仍然可以访问
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="菜单状态" prop="is_disable" required>
                    <div>
                        <el-radio-group v-model="formData.is_disable">
                            <el-radio :label="0">正常</el-radio>
                            <el-radio :label="1">停用</el-radio>
                        </el-radio-group>
                        <div class="form-tips">选择停用则路由将不会出现在侧边栏，也不能被访问</div>
                    </div>
                </el-form-item>
                <el-form-item label="菜单排序" prop="sort">
                    <div>
                        <el-input-number v-model="formData.sort" :min="0" :max="9999" />
                        <div class="form-tips">数值越大越排前</div>
                    </div>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { MenuEnum } from '@/enums/appEnums'
import Popup from '@/components/popup/index.vue'
import { arrayToTree, treeToArray } from '@/utils/util'
import {getModulesKey} from '@/router'
import {
    CustomerServiceCateAll,
    CustomerServiceCateEdit,
    CustomerServiceCateAdd,
    CustomerServiceCateDetail
} from '@/api/merchant'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑菜单' : '新增菜单'
})

const componentsOptions = ref(getModulesKey())
const querySearch = (queryString: string, cb: any) => {
    const results = queryString
        ? componentsOptions.value.filter((item) =>
              item.toLowerCase().includes(queryString.toLowerCase())
          )
        : componentsOptions.value
    cb(results.map((item) => ({ value: item })))
}
const formData = reactive({
    id: '',
    //父级id
    pid: 0,
    //名称
    name: '',
    //排序号
    sort: 0,
    //是否显示 0=否， 1=是
    is_show: 1,
    //是否禁用 0=否， 1=是
    is_disable: 0
})

const formRules = {
    pid: [
        {
            required: true,
            message: '请选择父级菜单',
            trigger: ['blur', 'change']
        }
    ],
    name: [
        {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
        }
    ]
}
const menuOptions = ref<any[]>([])

const getMenu = async () => {
    const data: any = await CustomerServiceCateAll({ page_type: 0 })
    const menu: any = { id: 0, name: '顶级', children: [] }
    menu.children = arrayToTree(
        treeToArray(data.lists).filter((item) => item.type != MenuEnum.BUTTON)
    )
    menuOptions.value.push(menu)
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    mode.value == 'edit'
        ? await CustomerServiceCateEdit(formData)
        : await CustomerServiceCateAdd(formData)
    popupRef.value?.close()
    emit('success')
}

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

const setFormData = (data: Record<any, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }
}

const getDetail = async (row: Record<string, any>) => {
    const data = await CustomerServiceCateDetail({
        id: row.id
    })
    setFormData(data)
}

const handleClose = () => {
    emit('close')
}

getMenu()

defineExpose({
    open,
    setFormData,
    getDetail
})
</script>
