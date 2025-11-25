import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FIELD_TYPE } from '../../constants/userConstant';
import { validatePassword } from '../../utils/appUtils';
import { isEmpty } from '../../utils/ValidationUtils';
import DMFieldText from '../shared/DMFieldText';
import { UserInterface } from '../../interfaces/interface';

interface ResetPasswordFieldProps extends WithTranslation {
    dispatch: (action: any) => void;
    user: UserInterface;
    RenderOptions: () => React.JSX.Element;
    resetingType: 'password' | 'shh_key';
}

const ResetPasswordField: React.FC<ResetPasswordFieldProps> = ({ dispatch, user, RenderOptions, resetingType, t }) => {
    const username = {
        placeHolderText: t('reset.placeholder.username'),
        type: FIELD_TYPE.TEXT,
        validate: (v: string, u: any) => isEmpty(v),
        errorMessage: t('errorMsg.username'),
        shouldShow: true,
        fieldInfo: 'info.enter.username',
    };

    const systemUsername = {
        placeHolderText: t('reset.placeholder.systemUsername'),
        type: FIELD_TYPE.TEXT,
        validate: (v: string, u: any) => isEmpty(v),
        errorMessage: t('errorMsg.systemUsername'),
        shouldShow: true,
        fieldInfo: 'info.system.username',
    };

    const systemPassword = {
        placeHolderText: t('reset.placeholder.systemPassword'),
        type: FIELD_TYPE.PASSWORD,
        validate: (v: string, u: any) => isEmpty(v),
        errorMessage: t('errorMsg.systemPassword'),
        shouldShow: true,
        fieldInfo: 'info.system.password',
    };

    const password = {
        placeHolderText: t('reset.placeholder.newPassword'),
        type: FIELD_TYPE.PASSWORD,
        // patterns: [PASSWORD_REGEX],
        errorMessage: t('errorMsg.newPassword'),
        shouldShow: true,
        fieldInfo: 'info.new_password',
    };

    const cnfPassword = {
        placeHolderText: t('reset.placeholder.cnfPassword'),
        type: FIELD_TYPE.PASSWORD,
        validate: (v: string, u: any) => validatePassword(v),
        errorMessage: t('errorMsg.confirmPassword'),
        shouldShow: true,
        fieldInfo: 'info.cnfm.password',
    };

    const sshKey = {
        placeHolderText: t('reset.placeholder.ssh_key'),
        type: FIELD_TYPE.TEXT,
        validate: (v: string, u: any) => isEmpty(v),
        errorMessage: t('errorMsg.sshkey'),
        shouldShow: true,
        fieldInfo: 'info.ssh_key',
    };

    function renderSSHKey() {
        if (resetingType === 'password') {
            return null;
        }
        return <DMFieldText dispatch={dispatch} fieldKey="user.ssh_key" field={sshKey} user={user} hideLabel="true" />;
    }

    function renderPassword() {
        if (resetingType !== 'password') {
            return null;
        }
        return <DMFieldText dispatch={dispatch} fieldKey="user.systemPassword" field={systemPassword} user={user} hideLabel="true" />;
    }

    return (
        <div style={{ margin: '0px 15px' }}>
            <DMFieldText dispatch={dispatch} fieldKey="user.username" field={username} user={user} hideLabel="true" />
            <DMFieldText dispatch={dispatch} fieldKey="user.systemUsername" field={systemUsername} user={user} hideLabel="true" />

            {RenderOptions()}
            {renderSSHKey()}
            {renderPassword()}
            <DMFieldText dispatch={dispatch} fieldKey="user.newPassword" field={password} user={user} hideLabel="true" />

            <DMFieldText dispatch={dispatch} fieldKey="user.confirmPassword" field={cnfPassword} user={user} hideLabel="true" />
        </div>
    );
};

export default withTranslation()(ResetPasswordField);
