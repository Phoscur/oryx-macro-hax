
import { MacroBuilder } from "../src/macros";


export function prepare(newMacro) {
type DelayCommand = {
    type: "delay";
    ms: number;
};
type Input = {
    input: string;
    modifier?: "shift" | "ctrl";
}
type InputCommand = {type: "input"} & Input;
type Command = InputCommand | DelayCommand;
type Tick = Command[];
type RsMacro = Tick[];

function skipTick(): DelayCommand {
    return {
        type: "delay",
        ms: 600
    };
}

function skipGcd(): DelayCommand {
    return {
        type: "delay",
        ms: 600 * 3
    };
}

function delay(ms: number): DelayCommand {
    return {
        type: "delay",
        ms
    };
}


function type(input: string, modifier?: "shift" | "ctrl"): InputCommand {
    return {
        type: "input",
            input,
            modifier
    };
}

function inputToBuilder(input: Input): MacroBuilder {
    return newMacro().typeAlphanumeric(input.input);
}

function inputCommand(macro: MacroBuilder, input: InputCommand): MacroBuilder {
    return macro.withModifier(inputToBuilder(input), input.modifier);
}

function delayCommand(macro: MacroBuilder, delay: DelayCommand): MacroBuilder {
    return macro.delay(delay.ms);
}

function executeMacro(macroSource: RsMacro): MacroBuilder {
    return macroSource.reduce((macro, tick) => {
        const m = tick.reduce((macro, command) => {
            if (command.type === "input") {
                return inputCommand(macro, command);
            }
            else if (command.type === "delay") {
                return delayCommand(macro, command);
            }
        }, macro);

        if (macroSource.length === 1) {
            return m;
        }

        return m.delay(900);
    }, newMacro());
}

function bd(): InputCommand {
    return {
        type: "input",
        input: "34",
        "modifier": "shift"
    };
}

function dw(): InputCommand {
    return {
        type: "input",
        input: "12",
        "modifier": "shift"
    };
}

function lunars(): InputCommand {
    return {
        type: "input",
        input: "y",
        modifier: "shift"
    };
}

function defender(): InputCommand {
    return {    
        type: "input",
        input: "5",
        modifier: "shift"
    };
}

function mainPassage(): InputCommand {
    return {
        type: "input",
        input: "n",
        modifier: "shift"
    };
}

function secondaryPassage(): InputCommand {
    return {
        type: "input",
        input: "q",
        modifier: "shift"
    };
}

function globeGloves(): InputCommand {
    return {
        type: "input",
        input: "z",
        modifier: "shift"
    };
}

function davesBook(): InputCommand {
    return {
        type: "input",
        input: "-",
        modifier: "shift"
    };
}

function caroming(): InputCommand {
    return {
        type: "input",
        input: "5",
        modifier: "shift"
    };
}

function teleportMacro(openCommand: InputCommand, keys: string[]): MacroBuilder {
    return executeMacro([
        [openCommand],
        ...keys.map(key => [type(key)]),
    ])
}

const macroExtensions = {
    "bd": executeMacro([[bd()]]),
    "dw": executeMacro([[dw()]]),
    "carom": executeMacro([
        [caroming(), delay(200), type("r")],
        [type("2", "shift")],
    ]),
    "pf": executeMacro([
        [defender(), type("d", "shift")],
        [type("2", "shift")],
    ]),
    "res": executeMacro([
        [type("6", "shift"), type("r", "ctrl")],
    ]),
    "ref": executeMacro([
        [type("6", "shift"), type("d", "ctrl")],
    ]),
    // target cycle
    "lred": executeMacro([
        [type("b", "ctrl")],
    ]),
    "veng": executeMacro([
        [lunars(), type("l", "shift")],
    ]),
    "dis": executeMacro([
        [lunars(), type("m", "shift")],
    ]),
    "bar": executeMacro([
       [defender(), type("z", "ctrl")],
    ]),
    "prep": executeMacro([
       [defender(), type("x", "ctrl")],
    ]),
    "rev": executeMacro([
       [defender(), type("c", "ctrl")],
    ]),
    "imort": executeMacro([
       [defender(), type("v", "ctrl")],
    ]),
    "ent": executeMacro([
        [lunars(), type("4", "ctrl")],
    ]),
    "ard": teleportMacro(davesBook(), ["4"]),
    "watch": teleportMacro(davesBook(), ["1"]),
    "came": teleportMacro(davesBook(), ["2"]),
    "fish": teleportMacro(mainPassage(), ["3", "1"]),
    "frem": teleportMacro(mainPassage(), ["1", "3"]),
    "kara": teleportMacro(mainPassage(), ["2", "2"]),
    "warf": teleportMacro(mainPassage(), ["5", "3"]),
    "hets": teleportMacro(mainPassage(), ["5", "1"]),
    "dray": teleportMacro(mainPassage(), ["2", "3"]),
    "rune": teleportMacro(mainPassage(), ["3", "7"]),
    "barb": teleportMacro(mainPassage(), ["4", "2"]),
    "range": teleportMacro(mainPassage(), ["6", "4"]),
    "holy": teleportMacro(mainPassage(), ["6", "3"]),
    "burgh": teleportMacro(mainPassage(), ["4", "6"]),
    "ban": teleportMacro(secondaryPassage(), ["4", "3"]),
    "lumb": teleportMacro(secondaryPassage(), ["3", "1"]),
    "exam": teleportMacro(secondaryPassage(), ["1", "3"]),
    "light": teleportMacro(globeGloves(), ["5"]),
    "yard": teleportMacro(globeGloves(), ["6"]),
    "zoo": teleportMacro(globeGloves(), ["3"]),
    "rs": newMacro()
        .altTab()
        .delay(600)
        .click()
        .delay(200)
        .altTab()
}
return { macroExtensions }
}