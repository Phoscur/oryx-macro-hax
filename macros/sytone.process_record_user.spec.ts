import { describe, it, expect } from '@jest/globals';
import { newMacro } from '../src/MacroBuilder';
import { expandMacros } from '../src/expandMacros';
import { prepare } from './sytone';

describe('Process sytone\'s layout file keymap.c: process_record_user function & dances', () => {
    it('should expand all macros inside C-code', () => {
        const userConfig = prepare(newMacro);
        expect(expandMacros(KEYMAPC, userConfig.macroExtensions)).toMatch(KEYMAPC_ENHANCED);
    });
});
// TODO? use snapshot(s)
const KEYMAPC = `bool process_record_user(uint16_t keycode, keyrecord_t *record) {
  switch (keycode) {
    case ST_MACRO_0:
    if (record->event.pressed) {
      SEND_STRING(SS_TAP(X_A) SS_DELAY(100) SS_TAP(X_B) SS_DELAY(100) SS_TAP(X_C) SS_DELAY(100) SS_TAP(X_D));
    }
    break;
    case ST_MACRO_1:
    if (record->event.pressed) {
      SEND_STRING(SS_LSFT(SS_TAP(X_MINUS)));
    }
    break;

    case TD(DANCE_0):
        action = &tap_dance_actions[TD_INDEX(keycode)];
        if (!record->event.pressed && action->state.count && !action->state.finished) {
            tap_dance_tap_hold_t *tap_hold = (tap_dance_tap_hold_t *)action->user_data;
            tap_code16(tap_hold->tap);
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
    case HSV_0_255_255:
        if (rawhid_state.rgb_control) {
            return false;
        }
        if (record->event.pressed) {
            rgblight_mode(1);
            rgblight_sethsv(0,255,255);
        }
        return false;
      case HSV_86_255_128:
        if (rawhid_state.rgb_control) {
            return false;
        }
        if (record->event.pressed) {
            rgblight_mode(1);
            rgblight_sethsv(86,255,128);
        }
        return false;
      case HSV_172_255_255:
        if (rawhid_state.rgb_control) {
            return false;
        }
        if (record->event.pressed) {
            rgblight_mode(1);
            rgblight_sethsv(172,255,255);
        }
        return false;
    }
  return true;
}


void tap_dance_tap_hold_finished(qk_tap_dance_state_t *state, void *user_data) {
    tap_dance_tap_hold_t *tap_hold = (tap_dance_tap_hold_t *)user_data;

    if (state->pressed) {
        if (state->count == 1
#ifndef PERMISSIVE_HOLD
            && !state->interrupted
#endif
        ) {
            register_code16(tap_hold->hold);
            tap_hold->held = tap_hold->hold;
        } else {
            register_code16(tap_hold->tap);
            tap_hold->held = tap_hold->tap;
        }
    }
}

void tap_dance_tap_hold_reset(qk_tap_dance_state_t *state, void *user_data) {
    tap_dance_tap_hold_t *tap_hold = (tap_dance_tap_hold_t *)user_data;

    if (tap_hold->held) {
        unregister_code16(tap_hold->held);
        tap_hold->held = 0;
    }
}

#define ACTION_TAP_DANCE_TAP_HOLD(tap, hold) \
    { .fn = {NULL, tap_dance_tap_hold_finished, tap_dance_tap_hold_reset}, .user_data = (void *)&((tap_dance_tap_hold_t){tap, hold, 0}), }

typedef struct {
    bool is_press_action;
    uint8_t step;
} tap;

enum {
    SINGLE_TAP = 1,
    SINGLE_HOLD,
    DOUBLE_TAP,
    DOUBLE_HOLD,
    DOUBLE_SINGLE_TAP,
    MORE_TAPS
};

static tap dance_state[1];

uint8_t dance_step(qk_tap_dance_state_t *state);

uint8_t dance_step(qk_tap_dance_state_t *state) {
    if (state->count == 1) {
        if (state->interrupted || !state->pressed) return SINGLE_TAP;
        else return SINGLE_HOLD;
    } else if (state->count == 2) {
        if (state->interrupted) return DOUBLE_SINGLE_TAP;
        else if (state->pressed) return DOUBLE_HOLD;
        else return DOUBLE_TAP;
    }
    return MORE_TAPS;
}


void on_dance_1(qk_tap_dance_state_t *state, void *user_data);
void dance_1_finished(qk_tap_dance_state_t *state, void *user_data);
void dance_1_reset(qk_tap_dance_state_t *state, void *user_data);

void on_dance_1(qk_tap_dance_state_t *state, void *user_data) {
    if(state->count == 3) {
        tap_code16(KC_A);
        tap_code16(KC_A);
        tap_code16(KC_A);
    }
    if(state->count > 3) {
        tap_code16(KC_A);
    }
}

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
}

qk_tap_dance_action_t tap_dance_actions[] = {
        [DANCE_0] = ACTION_TAP_DANCE_TAP_HOLD(KC_ESCAPE, KC_GRAVE),
        [DANCE_1] = ACTION_TAP_DANCE_FN_ADVANCED(on_dance_1, dance_1_finished, dance_1_reset),
};`;
const KEYMAPC_ENHANCED = `bool process_record_user(uint16_t keycode, keyrecord_t *record) {
  switch (keycode) {
    case ST_MACRO_0:
    if (record->event.pressed) {
      SEND_STRING(SS_TAP(X_A) SS_DELAY(100) SS_TAP(X_B) SS_DELAY(100) SS_TAP(X_C) SS_DELAY(100) SS_TAP(X_D));
    }
    break;
    case ST_MACRO_1:
    if (record->event.pressed) {
      SEND_STRING(SS_LSFT(SS_TAP(X_MINUS)));
    }
    break;

    case TD(DANCE_0):
        action = &tap_dance_actions[TD_INDEX(keycode)];
        if (!record->event.pressed && action->state.count && !action->state.finished) {
            tap_dance_tap_hold_t *tap_hold = (tap_dance_tap_hold_t *)action->user_data;
            tap_code16(tap_hold->tap);
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
    case HSV_0_255_255:
        if (rawhid_state.rgb_control) {
            return false;
        }
        if (record->event.pressed) {
            rgblight_mode(1);
            rgblight_sethsv(0,255,255);
        }
        return false;
      case HSV_86_255_128:
        if (rawhid_state.rgb_control) {
            return false;
        }
        if (record->event.pressed) {
            rgblight_mode(1);
            rgblight_sethsv(86,255,128);
        }
        return false;
      case HSV_172_255_255:
        if (rawhid_state.rgb_control) {
            return false;
        }
        if (record->event.pressed) {
            rgblight_mode(1);
            rgblight_sethsv(172,255,255);
        }
        return false;
    }
  return true;
}


void tap_dance_tap_hold_finished(qk_tap_dance_state_t *state, void *user_data) {
    tap_dance_tap_hold_t *tap_hold = (tap_dance_tap_hold_t *)user_data;

    if (state->pressed) {
        if (state->count == 1
#ifndef PERMISSIVE_HOLD
            && !state->interrupted
#endif
        ) {
            register_code16(tap_hold->hold);
            tap_hold->held = tap_hold->hold;
        } else {
            register_code16(tap_hold->tap);
            tap_hold->held = tap_hold->tap;
        }
    }
}

void tap_dance_tap_hold_reset(qk_tap_dance_state_t *state, void *user_data) {
    tap_dance_tap_hold_t *tap_hold = (tap_dance_tap_hold_t *)user_data;

    if (tap_hold->held) {
        unregister_code16(tap_hold->held);
        tap_hold->held = 0;
    }
}

#define ACTION_TAP_DANCE_TAP_HOLD(tap, hold) \
    { .fn = {NULL, tap_dance_tap_hold_finished, tap_dance_tap_hold_reset}, .user_data = (void *)&((tap_dance_tap_hold_t){tap, hold, 0}), }

typedef struct {
    bool is_press_action;
    uint8_t step;
} tap;

enum {
    SINGLE_TAP = 1,
    SINGLE_HOLD,
    DOUBLE_TAP,
    DOUBLE_HOLD,
    DOUBLE_SINGLE_TAP,
    MORE_TAPS
};

static tap dance_state[1];

uint8_t dance_step(qk_tap_dance_state_t *state);

uint8_t dance_step(qk_tap_dance_state_t *state) {
    if (state->count == 1) {
        if (state->interrupted || !state->pressed) return SINGLE_TAP;
        else return SINGLE_HOLD;
    } else if (state->count == 2) {
        if (state->interrupted) return DOUBLE_SINGLE_TAP;
        else if (state->pressed) return DOUBLE_HOLD;
        else return DOUBLE_TAP;
    }
    return MORE_TAPS;
}


void on_dance_1(qk_tap_dance_state_t *state, void *user_data);
void dance_1_finished(qk_tap_dance_state_t *state, void *user_data);
void dance_1_reset(qk_tap_dance_state_t *state, void *user_data);

void on_dance_1(qk_tap_dance_state_t *state, void *user_data) {
    if(state->count == 3) {
        tap_code16(KC_A);
        tap_code16(KC_A);
        tap_code16(KC_A);
    }
    if(state->count > 3) {
        tap_code16(KC_A);
    }
}

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
}

qk_tap_dance_action_t tap_dance_actions[] = {
        [DANCE_0] = ACTION_TAP_DANCE_TAP_HOLD(KC_ESCAPE, KC_GRAVE),
        [DANCE_1] = ACTION_TAP_DANCE_FN_ADVANCED(on_dance_1, dance_1_finished, dance_1_reset),
};`;
