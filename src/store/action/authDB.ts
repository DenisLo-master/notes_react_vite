import { IAuth } from '../../interfaces/LoginTypes'
import { db } from './indexDB'


export async function getAuthInfoDB(): Promise<IAuth | undefined> {
    try {
        const result = await db.getAuthInfo(1)
        return result
    } catch (error) {
        console.log(error)
    }
}
export async function addAuthInfoDB(auth: IAuth): Promise<void> {
    try {
        await db.createAuth(auth)
    } catch (error) {
        console.log(error)
    }
}
export async function updateAuthInfoDB(auth: IAuth): Promise<void> {
    try {
        await db.updateAuth(auth)
    } catch (error) {
        console.log(error)
    }
}
export async function clearAuthInfoDB(): Promise<void> {
    try {
        await db.auth.clear()
    } catch (error) {
        console.log('ERROR clear notes', error)
    }
}