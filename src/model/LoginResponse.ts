export default interface LoginResponse {
    accessToken: string;
    user: {
        email: string;
        id: string;
    }
}