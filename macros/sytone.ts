
export function prepare(newMacro) {

    const macroExtensions = {
        "dance_SINGLETAP_A": newMacro()
            .typeAlphanumeric("git status"),
        "dance_SINGLEHOLD_A": newMacro()
            .typeAlphanumeric("git log"),
        "dance_DOUBLETAP_A": newMacro()
            .typeAlphanumeric("ls -al"),
        "dance_DOUBLEHOLD_A": newMacro()
            .typeAlphanumeric("cp ../moonlander_hacked.bin /mnt/c/tools/"),
        //        case SINGLE_TAP: SEND_STRING("{}"); register_code(KC_LEFT); unregister_code(KC_LEFT); break;
    };

    return { macroExtensions };
}



