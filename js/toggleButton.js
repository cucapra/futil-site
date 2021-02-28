export function toggleButton(pass, value) {
    if (value) {
        pass.button.classList.replace("off", "on");
    }
    else {
        pass.button.classList.replace("on", "off");
    }
}
