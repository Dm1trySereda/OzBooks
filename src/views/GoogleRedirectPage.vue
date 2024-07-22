<script>
import userService from '@/services/users.service.js';
export default {
    mounted() {
        const searchCode = new URLSearchParams(window.location.search).get('code');
        const googleCode = {
            code: searchCode
        }
        if (searchCode) {
            try {
                // Отправляем код на бэкэнд 
                userService.googleLogInUser(googleCode);
                console.log(this.$route);
                this.$router.replace({ name: 'home' });
            } catch (error) {
                if (error.response.status === 400) {
                    // Обработка ошибки при авторизации через Google
                    console.error('Неверный код авторизации, полученный от Google', error.response.data);
                    this.$router.replace({ name: 'login' });
                }
            }
        } else {
            // Обработка случаев, когда код не был получен от Google
            console.error('Код авторизации от Google не получен.');
        }
    }
};
</script>