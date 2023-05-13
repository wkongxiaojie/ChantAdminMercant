<!-- 网站信息 -->
<template>
    <div class='setting_tab'>
        <el-tabs v-model='activeName' type='card' class='setting-tabs'>
            <el-tab-pane label='后台设置' name='backstage'>
                <el-form
                    ref='formRef'
                    :rules='rules'
                    class='ls-form'
                    :model='formData'
                    label-width='120px'
                >
                    <el-form-item label='网站名称' prop='web_name'>
                        <div>
                            <el-input
                                v-model.trim='formData.web_name'
                                placeholder='请输入网站名称'
                                maxlength='30'
                                show-word-limit
                            />
                        </div>
                    </el-form-item>

                    <el-form-item label='网站图标' prop='web_favicon' required>
                        <div>
                            <material-picker v-model='formData.web_favicon' :limit='1' />
                            <div class='form-tips'>
                                建议尺寸：100*100像素，支持jpg，jpeg，png格式
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label='网站LOGO' prop='web_logo' required>
                        <div>
                            <material-picker v-model.trim='formData.web_logo' :limit='1' />
                            <div class='form-tips'>
                                建议尺寸：100*100像素，支持jpg，jpeg，png格式
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label='登录页广告图' prop='login_image' required>
                        <div>
                            <material-picker v-model.trim='formData.login_image' :limit='1' />
                            <div class='form-tips'>
                                建议尺寸：100*100像素，支持jpg，jpeg，png格式
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label='版权' prop='copyright'>
                        <div class='w-80'>
                            <div>
                                <el-input v-model='formData.copyright' placeholder='请输入版权' />
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label='备案号' prop='icp_link'>
                        <div class='w-80'>
                            <div>
                                <el-input v-model.trim='formData.icp' placeholder='请输入备案号' />
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane label='客服设置' name='merchant'>
                <el-form
                    ref='formRef'
                    :rules='rules'
                    class='ls-form'
                    :model='formData'
                    label-width='120px'
                >
                    <el-form-item label='自动回复' prop='auto_reply'>
                        <div>
                            <el-switch
                                v-model='formData.auto_reply'
                                :active-value='1'
                                :inactive-value='0'
                            />
                            <span class='mt-1 ml-2'>{{
                                    formData.auto_reply ? '开启' : '关闭'
                                }}</span>

                            <div class='form-tips'>如果开启，则客服将自动回复</div>
                        </div>
                    </el-form-item>
                    <el-form-item label='欢迎语' prop='welcome'>
                        <div class='w-1/2'>
                            <el-input
                                v-model.trim='formData.welcome'
                                :value='formData.welcome'
                                type='textarea'
                            />
                        </div>
                    </el-form-item>
                    <el-form-item label='广告语' prop='ad_welcome'>
                        <div class='w-1/2'>
                            <el-input
                                v-model.trim='formData.ad_welcome'
                                :value='formData.ad_welcome'
                                type='textarea'
                            />
                        </div>
                    </el-form-item>
                    <el-form-item label='登录页广告图' prop='login_image' required>
                        <div>
                            <material-picker v-model.trim='formData.customer_service_login_image' :limit='1' />
                            <div class='form-tips'>
                                建议尺寸：100*100像素，支持jpg，jpeg，png格式
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <footer-btns>
                <el-button type='primary' @click='handleSubmit'>保存</el-button>
            </footer-btns>
        </el-tabs>
    </div>
</template>

<script lang='ts' setup name='merchantSetting'>
import { getConfig, setConfig } from '@/api/setting/merchant'
import useAppStore from '@/stores/modules/app'
import type { FormInstance } from 'element-plus'

const activeName = ref('backstage')

const formRef = ref<FormInstance>()

const appStore = useAppStore()
// 表单数据
const formData = reactive({
    web_name: '', // 网站名称
    web_favicon: '', // 网站图标
    web_logo: '', // 网站logo
    login_image: '', // 登录页广告图
    customer_service_login_image: '', // 登录页广告图
    auto_reply: 1,
    welcome: '欢迎光临~~~',
    ad_welcome: '欢迎光临~~~',
    copyright: '',
    icp: ''
})

// 表单验证
const rules = {
    name: [
        {
            required: true,
            message: '请输入网站名称',
            trigger: ['blur']
        }
    ],
    web_favicon: [
        {
            required: true,
            message: '请选择网站图标',
            trigger: ['change']
        }
    ],
    web_logo: [
        {
            required: true,
            message: '请选择网站logo',
            trigger: ['change']
        }
    ],
    login_image: [
        {
            required: true,
            message: '请选择登录页广告图',
            trigger: ['change']
        }
    ],
    customer_service_login_image: [
        {
            required: true,
            message: '请选择登录页广告图',
            trigger: ['change']
        }
    ]
}

// 获取配置信息
const getData = async () => {
    const data = await getConfig()
    for (const key in formData) {
        //@ts-ignore
        formData[key] = data[key]
    }
}

// 设置配置信息
const handleSubmit = async () => {
    await formRef.value?.validate()
    await setConfig(formData)
    await appStore.getConfig()
    await getData()
}

getData()
</script>

<style lang='scss' scoped>
.setting_tab {
  background-color: #fff;

  .setting-tabs {
    padding: 1vw !important;
  }
}
</style>
