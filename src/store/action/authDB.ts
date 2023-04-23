import { IAuth } from '../../interfaces/LoginTypes'
import { db } from './indexDB'


export async function getAuthInfoDB(): Promise<IAuth | undefined> {
    try {
        const authList = await db.getAuthInfo()
        if (authList.length) {
            return authList[authList.length - 1]
        } else {
            return
        }
    } catch (error) {
        console.log("ERROR getAuthInfoDB", error)
        return
    }
}
export async function addAuthInfoDB(auth: IAuth): Promise<void> {
    try {
        await db.addAuthInfo(auth)
    } catch (error) {
        console.log("ERROR addAuthInfoDB", error)
    }
}
export async function updateAuthInfoDB(auth: IAuth): Promise<void> {
    try {
        await db.updateAuth(auth)
    } catch (error) {
        console.log("ERROR updateAuthInfoDB", error)
    }
}
export async function clearAuthInfoDB(): Promise<void> {
    try {
        await db.auth.clear()
    } catch (error) {
        console.log('ERROR clearAuthInfoDB', error)
    }
}