
interface ShowToastProps{
    message: string;
    type: 'success' | 'error' |'update'|'invitation_sended'|'invitation';
}
export default function ToastManager({message, type}: ShowToastProps){
    if(type == 'error'){
        const ErrorToast = require('./toast.error').default;
        ErrorToast(message)
        return;
    }else if(type == 'success'.toLowerCase()){
        const SuccessToast = require('./toast.success').default;
        return (<SuccessToast message={message} />)
    }else if(type == 'update'.toLowerCase()){
        const UpdateToast = require('./toast.update').default;
        return (<UpdateToast message={message} />)

    }else if(type == 'invitation_sended'.toLowerCase()){
        const InvitationSendedToast = require('./toast.invitationsend').default;
        return (<InvitationSendedToast message={message} />)
    }else if(type == 'invitation'.toLowerCase()){
        const InvitationToast = require('./toast.invitation').default;
        return (<InvitationToast message={message} />)
    }

}