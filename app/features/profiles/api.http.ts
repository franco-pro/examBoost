import apiClient from "@/app/api/apiClient"
import { getHttpErrorMessage } from "@/app/lib/http"

export type ProfileDTO = {
    id: number,
    username: string,
    surname: string,
    email: string,
    phone: string,
    niveauID: number,
    created_at: string,
    update_at: string
}

export async function fetchProfileHttp(params: { userID: string }): Promise<ProfileDTO[]>{
    try {
        const res = await apiClient.get(`users/${params.userID}`)
        const result = res.data as ProfileDTO[]
        return result
    } catch (error:any) {
        throw new Error(getHttpErrorMessage(error))
    }
}

export async function updateProfileHttp(params: { userID: string, data: ProfileDTO }): Promise<ProfileDTO[]>{
    try {
        const res = await apiClient.patch(`users/${params.userID}`, params.data)
        const result = res.data
        return result
    } catch (error) {
        throw new Error(getHttpErrorMessage(error))
    }
}
