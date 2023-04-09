import { readFileSync, writeFileSync } from "fs";

export interface MacroBuilder {
    delay: (milliseconds: number) => MacroBuilder,

    sendRawCmd: (rawCmd: string) => MacroBuilder,

    // Works with a-z, 0-9, space and newline-as-enter
    typeAlphanumeric: (strToType: string, msDelayBetweenStrokes?: number) => MacroBuilder,

    tapKey: (rawKey: string, msDelayAfter?: number) => MacroBuilder,

    withModifier(innerMacro: MacroBuilder, modifier?: "ctrl" | "shift"): MacroBuilder;

    withModifiers: (innerMacro: MacroBuilder, rawModifiers: string[]) => MacroBuilder,

    withShift: (innerMacro: MacroBuilder) => MacroBuilder,

    withCtrl: (innerMacro: MacroBuilder) => MacroBuilder,

    withWin: (innerMacro: MacroBuilder) => MacroBuilder,

    withAlt: (innerMacro: MacroBuilder) => MacroBuilder,

    altTab: () => MacroBuilder,

    click: () => MacroBuilder,

    build: () => string,

    expectedReplacements: number,
}

export const newMacro: (expectedReplacementCount?: number) => MacroBuilder = (erc: number = 1) => {
    const commands: (() => string)[] = []
    const self: MacroBuilder = {
        expectedReplacements: erc,
        tapKey: (rawKey: string, msDelayAfter: number) => {
            if (!rawKey.startsWith("X_")) {
                throw new Error("rawKey must come from the underlying language thingy, maybe you meant X_" + rawKey.toUpperCase() + " or something?");
            }
            commands.push(() => `SS_TAP(${rawKey})`);
            if (msDelayAfter > 0) {
                self.delay(msDelayAfter)
            }
            return self;
        },
        // Works with a-z, 0-9, space and newline-as-enter
        // https://github.com/qmk/qmk_firmware/blob/master/quantum/send_string/send_string_keycodes.h
        typeAlphanumeric: (strToType: string, msDelayBetweenStrokes: number = 30) => {
            for (let i = 0; i < strToType.length; i++) {
                const char = strToType[i]
                if (char !== char.toLowerCase()) {
                    self.withShift(newMacro().typeAlphanumeric(char.toLowerCase()))
                }
                else if (char !== char.toUpperCase() || (char >= "0" && char <= "9")) {
                    self.tapKey(`X_${char.toUpperCase()}`, msDelayBetweenStrokes);
                }
                else if (char === " ") {
                    self.tapKey("X_SPACE")
                }
                else if (char === "\n") {
                    self.tapKey("X_ENTER")
                }
                else if (char === "=") {
                    self.tapKey("X_EQUAL")
                }
                else if (char === "[") {
                    self.tapKey("X_LBRACKET")
                }
                else if (char === "]") {
                    self.tapKey("X_RBRACKET")
                }
                else if (char === ";") {
                    self.tapKey("X_SEMICOLON")
                }
                else if (char === ",") {
                    self.tapKey("X_COMMA")
                }
                else if (char === ".") {
                    self.tapKey("X_DOT")
                }
                else if (char === "+") {
                    self.tapKey("X_PLUS")
                }
                else if (char === "-") {
                    self.tapKey("X_MINUS")
                }
                else if (char === "/") {
                    self.tapKey("X_SLASH")
                }
                else if (char === "'") {
                    self.tapKey("X_QUOTE")
                }
                else if (char === '"') {
                    self.withShift(newMacro().tapKey("X_QUOTE"))
                }
                else if (char === '_') {
                    self.withShift(newMacro().tapKey("X_MINUS"))
                }
                else if (char === "!") {
                    self.withShift(newMacro().tapKey("X_1"))
                }
                else if (char === "@") {
                    self.withShift(newMacro().tapKey("X_2"))
                }
                else if (char === "(") {
                    self.withShift(newMacro().tapKey("X_8"))
                }
                else if (char === ")") {
                    self.withShift(newMacro().tapKey("X_9"))
                }
                else {
                    throw Error("Unsupported char in typeAlphanumeric: " + char + ", use typeRaw instead?")
                }

                if (msDelayBetweenStrokes > 0) {
                    self.delay(msDelayBetweenStrokes);
                }
            }
            return self;
        },
        delay: (msDelay: number) => {
            self.sendRawCmd("SS_DELAY(" + msDelay + ")");
            return self;
        },
        sendRawCmd: (rawCmd: string) => {
            commands.push(() => rawCmd)
            return self
        },
        withModifier: (innerMacro: MacroBuilder, modifier?: "ctrl" | "shift") => {
            if (modifier === "ctrl") {
                return self.withCtrl(innerMacro)
            }
            else if (modifier === "shift") {
                return self.withShift(innerMacro)
            }
            else {
                commands.push(() => innerMacro.build());
                return self;
            }
        },
        // Runs some inner macro while holding down all
        // modifier keys
        withModifiers: (
            innerMacro: MacroBuilder,
            rawModifiers: string[]) => {
            commands.push(() =>
                rawModifiers.map((m) => `${m}(`) +
                innerMacro.build() +
                rawModifiers.map(() => ")"));
            return self
        },
        withShift: (innerMacro: MacroBuilder) => {
            return self.withModifiers(innerMacro, ["SS_LSFT"])
        },
        withCtrl: (innerMacro: MacroBuilder) => {
            return self.withModifiers(innerMacro, ["SS_LCTL"])
        },
        withWin: (innerMacro: MacroBuilder) => {
            return self.withModifiers(innerMacro, ["SS_LWIN"])
        },
        withAlt: (innerMacro: MacroBuilder) => {
            return self.withModifiers(innerMacro, ["SS_LALT"])
        },
        altTab: () => {
            return self.withAlt(newMacro().tapKey("X_TAB"))
        },
        click: () => {
            return self.tapKey("X_MS_BTN1")
        },
        build: () => {
            const cmds = commands.map((cmd) => cmd())
            // Trim delays off the ends of commands
            while (cmds.length > 0 && cmds[cmds.length - 1].startsWith("SS_DELAY")) {
                cmds.splice(cmds.length - 1, 1)
            }
            return cmds.join(" ");
        }
    };

    return self;
}

function charStrToMacro(keys: string): MacroBuilder {
    if (keys.length < 1 || keys.length > 5) {
        throw new Error("Please check macro ID for " + keys);
    }
    let macro = newMacro();
    for (let i = 0; i < keys.length; i++) {
        macro = macro.tapKey(`X_${keys[i].toUpperCase()}`)
        if (i < keys.length - 1) {
            macro = macro.delay(100);
        }
    }
    return macro;
}

// Please Refactor, make it shorter, simpler
export const processAll = (macroMap: {
    [originalMacroKeys: string]: MacroBuilder
}, keymapFile: string) => {
    const loaded = readFileSync(keymapFile).toString()
    const orig = Object.keys(macroMap)
    orig.forEach((macroKeys) => {

        if (macroKeys.startsWith('dance_')) {
            const step = macroKeys.split("_")[1]
            console.log(step)
            let caseStep = "";

            if (step === "SINGLETAP") {
                caseStep = "SINGLE_TAP"
            } else if (step === "SINGLEHOLD") {
                caseStep = "SINGLE_HOLD"
            } else if (step === "DOUBLETAP") {
                caseStep = "DOUBLE_TAP"
            } else if (step === "DOUBLEHOLD") {
                caseStep = "DOUBLE_HOLD"
            }

            const toFind = "case " + caseStep + ": register_code16(KC_" + macroKeys.split("_")[2] + "); break;"

            console.log("Finding:" + toFind)

            const newMacro = macroMap[macroKeys]
            const matchCount = loaded.split(toFind).length - 1
            if (matchCount !== newMacro.expectedReplacements) {
                console.error(toFind)
                throw new Error(`Found ${matchCount} instances of the ${macroKeys} macro but expected ${newMacro.expectedReplacements} instances!  Check your config and set the proper value in newMacro()`)
            }

        } else {

            const toFind = "SEND_STRING(" + charStrToMacro(macroKeys).build() + ")"
            const newMacro = macroMap[macroKeys]
            const matchCount = loaded.split(toFind).length - 1
            if (matchCount !== newMacro.expectedReplacements) {
                console.error(toFind)
                throw new Error(`Found ${matchCount} instances of the ${macroKeys} macro but expected ${newMacro.expectedReplacements} instances!  Check your config and set the proper value in newMacro()`)
            }
        }
    })

    const backup = keymapFile + Math.random() + ".old-"
    console.log("Backed up keymap.c to " + backup)
    writeFileSync(backup, loaded)

    let newConfig = `${loaded}`
    orig.forEach((macroKeys) => {
        if (macroKeys.startsWith('dance_')) {
            const step = macroKeys.split("_")[1]
            const newMacro = macroMap[macroKeys]
            const macro = "SEND_STRING(" + newMacro.build() + ")"
            let caseStep = "";

            if (step === "SINGLETAP") {
                caseStep = "SINGLE_TAP"
            } else if (step === "SINGLEHOLD") {
                caseStep = "SINGLE_HOLD"
            } else if (step === "DOUBLETAP") {
                caseStep = "DOUBLE_TAP"
            } else if (step === "DOUBLEHOLD") {
                caseStep = "DOUBLE_HOLD"
            }

            const toFind = "case " + caseStep + ": register_code16(KC_" + macroKeys.split("_")[2] + "); break;"
            const replacement = "case " + caseStep + ": " + macro + "; break;"
            const toFindReset = "case " + caseStep + ": unregister_code16(KC_" + macroKeys.split("_")[2] + "); break;"
            const replacementReset = "case " + caseStep + ": break;"


            for (let i = 0; i < newMacro.expectedReplacements; i++) {
                console.log("Replacing \n" + toFind + "\nwith\n" + replacement)
                newConfig = newConfig.replace(toFind, replacement)

                console.log("Replacing \n" + toFindReset + "\nwith\n" + replacementReset)
                newConfig = newConfig.replace(toFindReset, replacementReset)
            }

        } else {
            const toFind = "SEND_STRING(" + charStrToMacro(macroKeys).build() + ")"
            const newMacro = macroMap[macroKeys]
            const macro = "SEND_STRING(" + newMacro.build() + ")"
            for (let i = 0; i < newMacro.expectedReplacements; i++) {
                console.log("Replacing \n" + toFind + "\nwith\n" + macro)
                newConfig = newConfig.replace(toFind, macro)
            }
        }
    })
    writeFileSync(keymapFile, newConfig)
    console.log("ALL done! Proceed with compilation and flashing")
};
