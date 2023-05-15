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
            <el-form ref="formRef" :model="formData" label-width="84px" :rules="formRules">
                <!-- 账号输入框 -->
                <el-form-item label="账号" prop="account">
                    <el-input v-model="formData.account" placeholder="请输入账号" clearable />
                </el-form-item>

                <!-- 手机号输入框 -->
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="formData.mobile" placeholder="请输入手机号" clearable />
                </el-form-item>

                <!-- 管理员头像 -->
                <el-form-item label="头像">
                    <div>
                        <div>
                            <material-picker v-model="formData.avatar" :limit="1" />
                        </div>
                        <div class="form-tips">建议尺寸：100*100px，支持jpg，jpeg，png格式</div>
                    </div>
                </el-form-item>

                <!-- 姓名输入框 -->
                <el-form-item label="姓名" prop="real_name">
                    <el-input v-model="formData.real_name" placeholder="请输入名称" clearable />
                </el-form-item>

                <!-- 昵称输入框 -->
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="formData.nickname" placeholder="请输入昵称" clearable />
                </el-form-item>

                <!-- 密码输入框 -->
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="formData.password"
                        show-password
                        clearable
                        placeholder="请输入密码"
                    />
                </el-form-item>

                <!-- 确认密码输入框 -->
                <el-form-item label="确认密码" prop="password_confirm">
                    <el-input
                        v-model="formData.password_confirm"
                        show-password
                        clearable
                        placeholder="请输入确认密码"
                    />
                </el-form-item>

                <!-- 管理员状态 -->
                <el-form-item label="状态">
                    <el-switch
                        v-model="formData.is_disable"
                        :active-value="0"
                        :inactive-value="1"
                    />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'

import {
    CustomerServiceAdd,
    CustomerServiceDetail,
    CustomerServiceEdit
} from '@/api/merchant'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑客服' : '新增客服'
})
const formData = reactive({
    id: '',
    account: '',
    mobile: '',
    real_name: '',
    nickname: '',
    avatar: '',
    password: '',
    password_confirm: '',
    is_disable: 0
})

const formRules = reactive({
    account: [
        {
            required: true,
            message: '请输入账号',
            trigger: ['blur']
        }
    ],
    mobile: [
        {
            required: true,
            message: '请输入手机号',
            trigger: ['blur']
        }
    ],
    real_name: [
        {
            required: true,
            message: '请输入姓名',
            trigger: ['blur']
        }
    ],
    nickname: [
        {
            required: true,
            message: '请输入昵称',
            trigger: ['blur']
        }
    ],

    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: ['blur']
        }
    ] as any[],
    password_confirm: [
        {
            required: true,
            message: '请输入确认密码',
            trigger: ['blur']
        }
    ] as any[]
})

const handleSubmit = async () => {
    await formRef.value?.validate()
    mode.value == 'edit' ? await CustomerServiceEdit(formData) : await CustomerServiceAdd(formData)
    popupRef.value?.close()
    emit('success')
}

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

const setFormData = async (row: any) => {
    formRules.password = []
    formRules.password_confirm = []

    const data = await CustomerServiceDetail({
        id: row.id
    })
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }
}

const handleClose = () => {
    emit('close')
}

defineExpose({
    open,
    setFormData
})
</script>
