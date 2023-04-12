import { describe, it, expect } from "@jest/globals";
import { charStrToMacro, newMacro } from "./MacroBuilder";
import { expandMacros } from "./expandMacros";

describe("Process Macros", () => {
    it("should replace macros in the keymap file with the corresponding macro expansion", () => {
        const macroMap = {
            "symbo": newMacro()
                .typeAlphanumeric("=+,;[]!\"' @"), // TODO add "?"
            "gg": newMacro()
                .typeAlphanumeric("\n(Gg)\n"),
            dance_SINGLETAP_A: newMacro()
                .typeAlphanumeric("git status"),
            dance_SINGLEHOLD_A: newMacro()
                .typeAlphanumeric("git log"),
            dance_DOUBLETAP_A: newMacro()
                .typeAlphanumeric("ls -al"),
            dance_DOUBLEHOLD_A: newMacro()
                .typeAlphanumeric("cp ../moonlander_hacked.bin /mnt/c/tools/"),
        };

        const originalKeymap = `
        case ST_MACRO_1:
        if (record->event.pressed) {
          SEND_STRING(SS_TAP(X_S) SS_DELAY(100) SS_TAP(X_Y) SS_DELAY(100) SS_TAP(X_M) SS_DELAY(100) SS_TAP(X_B) SS_DELAY(100) SS_TAP(X_O));
        }
        break;
        case ST_MACRO_2:
        if (record->event.pressed) {
          SEND_STRING(SS_TAP(X_G) SS_DELAY(100) SS_TAP(X_G));
        }
        break;

        void dance_1_finished(qk_tap_dance_state_t *state, void *user_data) {
            dance_state[0].step = dance_step(state);
            switch (dance_state[0].step) {
                case SINGLE_TAP: register_code16(KC_A); break;
                case SINGLE_HOLD: register_code16(KC_A); break;
                case DOUBLE_TAP: register_code16(KC_A); break;
                case DOUBLE_HOLD: register_code16(KC_A); break;
                case DOUBLE_SINGLE_TAP: tap_code16(KC_A); register_code16(KC_A);
            }
        }

        void dance_1_reset(qk_tap_dance_state_t *state, void *user_data) {
            wait_ms(10);
            switch (dance_state[0].step) {
                case SINGLE_TAP: unregister_code16(KC_A); break;
                case SINGLE_HOLD: unregister_code16(KC_A); break;
                case DOUBLE_TAP: unregister_code16(KC_A); break;
                case DOUBLE_HOLD: unregister_code16(KC_A); break;
                case DOUBLE_SINGLE_TAP: unregister_code16(KC_A); break;
            }
            dance_state[0].step = 0;
        }`;

        const keymap = expandMacros(originalKeymap, macroMap);

        expect(keymap).toEqual(`
        case ST_MACRO_1:
        if (record->event.pressed) {
          SEND_STRING(SS_TAP(X_EQUAL) SS_DELAY(30) SS_TAP(X_PLUS) SS_DELAY(30) SS_TAP(X_COMMA) SS_DELAY(30) SS_TAP(X_SEMICOLON) SS_DELAY(30) SS_TAP(X_LBRACKET) SS_DELAY(30) SS_TAP(X_RBRACKET) SS_DELAY(30) SS_LSFT(SS_TAP(X_1)) SS_DELAY(30) SS_LSFT(SS_TAP(X_QUOTE)) SS_DELAY(30) SS_TAP(X_QUOTE) SS_DELAY(30) SS_TAP(X_SPACE) SS_DELAY(30) SS_LSFT(SS_TAP(X_2)));
        }
        break;
        case ST_MACRO_2:
        if (record->event.pressed) {
          SEND_STRING(SS_TAP(X_ENTER) SS_DELAY(30) SS_LSFT(SS_TAP(X_8)) SS_DELAY(30) SS_LSFT(SS_TAP(X_G)) SS_DELAY(30) SS_TAP(X_G) SS_DELAY(30) SS_DELAY(30) SS_LSFT(SS_TAP(X_9)) SS_DELAY(30) SS_TAP(X_ENTER));
        }
        break;

        void dance_1_finished(qk_tap_dance_state_t *state, void *user_data) {
            dance_state[0].step = dance_step(state);
            switch (dance_state[0].step) {
                case SINGLE_TAP: SEND_STRING(SS_TAP(X_G) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_I) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_T) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_SPACE) SS_DELAY(30) SS_TAP(X_S) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_T) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_A) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_T) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_U) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_S)); break;
                case SINGLE_HOLD: SEND_STRING(SS_TAP(X_G) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_I) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_T) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_SPACE) SS_DELAY(30) SS_TAP(X_L) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_O) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_G)); break;
                case DOUBLE_TAP: SEND_STRING(SS_TAP(X_L) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_S) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_SPACE) SS_DELAY(30) SS_TAP(X_MINUS) SS_DELAY(30) SS_TAP(X_A) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_L)); break;
                case DOUBLE_HOLD: SEND_STRING(SS_TAP(X_C) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_P) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_SPACE) SS_DELAY(30) SS_TAP(X_DOT) SS_DELAY(30) SS_TAP(X_DOT) SS_DELAY(30) SS_TAP(X_SLASH) SS_DELAY(30) SS_TAP(X_M) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_O) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_O) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_N) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_L) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_A) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_N) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_D) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_E) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_R) SS_DELAY(30) SS_DELAY(30) SS_LSFT(SS_TAP(X_MINUS)) SS_DELAY(30) SS_TAP(X_H) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_A) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_C) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_K) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_E) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_D) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_DOT) SS_DELAY(30) SS_TAP(X_B) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_I) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_N) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_SPACE) SS_DELAY(30) SS_TAP(X_SLASH) SS_DELAY(30) SS_TAP(X_M) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_N) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_T) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_SLASH) SS_DELAY(30) SS_TAP(X_C) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_SLASH) SS_DELAY(30) SS_TAP(X_T) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_O) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_O) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_L) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_S) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_SLASH)); break;
                case DOUBLE_SINGLE_TAP: tap_code16(KC_A); register_code16(KC_A);
            }
        }

        void dance_1_reset(qk_tap_dance_state_t *state, void *user_data) {
            wait_ms(10);
            switch (dance_state[0].step) {
                case SINGLE_TAP: break;
                case SINGLE_HOLD: break;
                case DOUBLE_TAP: break;
                case DOUBLE_HOLD: break;
                case DOUBLE_SINGLE_TAP: unregister_code16(KC_A); break;
            }
            dance_state[0].step = 0;
        }`);
    });

    it('should fail if a macro cannot be found', () => {
        const macroMap = {
            "gg": newMacro().typeAlphanumeric("(gg)"),
        };

        const originalKeymap = `
        case ST_MACRO_11:
        if (record->event.pressed) {
          SEND_STRING(SS_TAP(X_F) SS_DELAY(100) SS_TAP(X_F));
        }
        break;`;

        expect(() => expandMacros(originalKeymap, macroMap)).toThrow(
            new Error(`Found 0 instances of the "gg" macro but expected 1 instances!
         - Check your config and set the proper value in newMacro()
         Macro code: SEND_STRING(SS_TAP(X_G) SS_DELAY(100) SS_TAP(X_G))`
            ));
    });
    it('should fail if a char is not supported', () => {
        expect(() => newMacro().typeAlphanumeric("?")).toThrow(
            new Error(`Unsupported char in typeAlphanumeric: ?, use typeRaw instead?`
            ));
    });
    it('should fail if the macro name is too long', () => {
        expect(() => charStrToMacro("toolong")).toThrow(
            new Error(`Please check macro ID length for "toolong"`
            ));
    });
});
