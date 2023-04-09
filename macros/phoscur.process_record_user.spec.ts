import { describe, it, expect } from '@jest/globals';
import { newMacro, process } from '../src/macros';
import { prepare } from './phoscur';

describe('Process layout file keymap.c: process_record_user function', () => {
  it('should expand all macros inside C-code', () => {
    const userConfig = prepare(newMacro);
    expect(process(KEYMAPC, userConfig.macroExtensions)).toMatch(KEYMAPC_ENHANCED);
  });
});

const KEYMAPC = `
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
  switch (keycode) {
    case ST_MACRO_0:
    if (record->event.pressed) {
      SEND_STRING(SS_TAP(X_P) SS_DELAY(100) SS_TAP(X_O) SS_DELAY(100) SS_TAP(X_K) SS_DELAY(100) SS_TAP(X_E));
    }
    break;
    case ST_MACRO_1:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_0) SS_TAP(X_KP_1) SS_TAP(X_KP_8) SS_TAP(X_KP_5) ));
    }
    break;
    case ST_MACRO_2:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_9) SS_TAP(X_KP_4) ));
    }
    break;
    case ST_MACRO_3:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_PLUS) SS_TAP(X_KP_2) SS_TAP(X_KP_0) SS_TAP(X_KP_2) SS_TAP(X_KP_2) ));
    }
    break;
    case ST_MACRO_4:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_9) SS_TAP(X_KP_6) ));
    }
    break;
    case ST_MACRO_5:
    if (record->event.pressed) {
      SEND_STRING(SS_TAP(X_D) SS_DELAY(100) SS_TAP(X_E) SS_DELAY(100) SS_TAP(X_V));
    }
    break;
    case ST_MACRO_6:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_PLUS) SS_TAP(X_KP_0) SS_TAP(X_KP_0) SS_TAP(X_KP_2) SS_TAP(X_KP_3) ));
    }
    break;
    case ST_MACRO_7:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_0) SS_TAP(X_KP_1) SS_TAP(X_KP_5) SS_TAP(X_KP_3) ));
    }
    break;
    case ST_MACRO_8:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_PLUS) SS_TAP(X_KP_2) SS_TAP(X_KP_0) SS_TAP(X_KP_2) SS_TAP(X_KP_6) ));
    }
    break;
    case ST_MACRO_9:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_PLUS) SS_TAP(X_KP_2) SS_TAP(X_KP_7) SS_TAP(X_KP_1) SS_TAP(X_KP_7) ));
    }
    break;
    case ST_MACRO_10:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_PLUS) SS_TAP(X_KP_2) SS_TAP(X_KP_7) SS_TAP(X_KP_1) SS_TAP(X_KP_3) ));
    }
    break;
    case ST_MACRO_11:
    if (record->event.pressed) {
      SEND_STRING(SS_TAP(X_G) SS_DELAY(100) SS_TAP(X_G));
    }
    break;

    case RGB_SLD:
        if (rawhid_state.rgb_control) {
            return false;
        }
        if (record->event.pressed) {
            rgblight_mode(1);
        }
        return false;
  }
  return true;
}`;
const KEYMAPC_ENHANCED = `
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
  switch (keycode) {
    case ST_MACRO_0:
    if (record->event.pressed) {
      SEND_STRING(SS_TAP(X_P) SS_DELAY(100) SS_TAP(X_O) SS_DELAY(100) SS_TAP(X_K) SS_DELAY(100) SS_TAP(X_E));
    }
    break;
    case ST_MACRO_1:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_0) SS_TAP(X_KP_1) SS_TAP(X_KP_8) SS_TAP(X_KP_5) ));
    }
    break;
    case ST_MACRO_2:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_9) SS_TAP(X_KP_4) ));
    }
    break;
    case ST_MACRO_3:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_PLUS) SS_TAP(X_KP_2) SS_TAP(X_KP_0) SS_TAP(X_KP_2) SS_TAP(X_KP_2) ));
    }
    break;
    case ST_MACRO_4:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_9) SS_TAP(X_KP_6) ));
    }
    break;
    case ST_MACRO_5:
    if (record->event.pressed) {
      SEND_STRING(SS_TAP(X_D) SS_DELAY(100) SS_TAP(X_E) SS_DELAY(100) SS_TAP(X_V));
    }
    break;
    case ST_MACRO_6:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_PLUS) SS_TAP(X_KP_0) SS_TAP(X_KP_0) SS_TAP(X_KP_2) SS_TAP(X_KP_3) ));
    }
    break;
    case ST_MACRO_7:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_0) SS_TAP(X_KP_1) SS_TAP(X_KP_5) SS_TAP(X_KP_3) ));
    }
    break;
    case ST_MACRO_8:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_PLUS) SS_TAP(X_KP_2) SS_TAP(X_KP_0) SS_TAP(X_KP_2) SS_TAP(X_KP_6) ));
    }
    break;
    case ST_MACRO_9:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_PLUS) SS_TAP(X_KP_2) SS_TAP(X_KP_7) SS_TAP(X_KP_1) SS_TAP(X_KP_7) ));
    }
    break;
    case ST_MACRO_10:
    if (record->event.pressed) {
      SEND_STRING(SS_LALT(SS_TAP(X_KP_PLUS) SS_TAP(X_KP_2) SS_TAP(X_KP_7) SS_TAP(X_KP_1) SS_TAP(X_KP_3) ));
    }
    break;
    case ST_MACRO_11:
    if (record->event.pressed) {
      SEND_STRING(SS_TAP(X_ENTER) SS_LSFT(SS_TAP(X_8)) SS_DELAY(30) SS_TAP(X_G) SS_DELAY(30) SS_DELAY(30) SS_TAP(X_G) SS_DELAY(30) SS_DELAY(30) SS_LSFT(SS_TAP(X_9)) SS_DELAY(30) SS_TAP(X_ENTER));
    }
    break;

    case RGB_SLD:
        if (rawhid_state.rgb_control) {
            return false;
        }
        if (record->event.pressed) {
            rgblight_mode(1);
        }
        return false;
  }
  return true;
}`;