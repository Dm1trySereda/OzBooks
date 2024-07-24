<script>
import userService from '@/services/users.service.js';
export default {
    async mounted() {
        const searchCode = new URLSearchParams(window.location.search).get('code');
        const googleCode = {
            code: searchCode
        }
        if (searchCode) {
            try {
                // Отправляем код 
                await userService.googleLogInUser(googleCode);
                } catch (error) {
                if (error.response.status === 400) {
                    // Обработка ошибки при авторизации через Google
                    console.error('Неверный код авторизации, полученный от Google', error.response.data);
                    this.$router.replace({ name: 'login' });
                }
            }
        } else {
            // Обработка случаев, когда код не был получен от Google
            console.error('Ошибка при попытке авторизации через Google');
        }
    }
};
</script>