import { ref, onMounted, onUnmounted } from 'vue'

export function useClock() {
    const clock = ref('')

    const update = () => {
        clock.value = new Date().toLocaleString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
    }

    let timer
    onMounted(() => {
        update()
        timer = setInterval(update, 1000)
    })
    onUnmounted(() => clearInterval(timer))

    return { clock }
}