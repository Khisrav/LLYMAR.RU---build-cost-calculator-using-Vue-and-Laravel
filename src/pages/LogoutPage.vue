<script>
import { logout } from '../core/auth';

export default {
    async mounted() {
        try {
            const response = await logout();
            console.log(response);
            this.$router.push('/');
        } catch (error) {
            console.log(error);
        }
    }
}
</script>

<template>

</template>