import { newMacro, processAll } from "./macros";

// Point this at wherever your config root folder is
const SOURCE_DIR = "./test/moonlander_neophil-autobahn-fueled-wip_source/keymap.c";

const macroExtensions = {

    // Application quick launches
    /*"fire": newMacro()
        .tapKey("X_LGUI", 100)
        .typeAlphanumeric("firefox\n"),*/
    "dev": newMacro()
        .tapKey("X_LGUI", 100)
        .typeAlphanumeric("visual studio c\n"),
        
    "gg": newMacro()
        .withShift(newMacro()
            .tapKey("X_LBRACKET")
            .typeAlphanumeric("gg")
            .tapKey("X_RBRACKET"))
        .tapKey("X_ENTER"),

    // Git shortcuts
    /*"add": newMacro(0)
        .typeAlphanumeric("git add -A"),
    "comm": newMacro(1)
        .typeAlphanumeric("git commit -m \"\"")
        .tapKey("X_LEFT"),
    "push": newMacro(1)
        .typeAlphanumeric("git push"),
    //*/
    // Macros for Typescript mode, type full keywords beyond 4 characters
    /*"cons": newMacro()
        .typeAlphanumeric("const "),
    "retu": newMacro()
        .typeAlphanumeric("return "),
    "whil": newMacro()
        .typeAlphanumeric("while ")
        // Open and closing parenthesis and brackets
        .withShift(newMacro().typeAlphanumeric("90 []"))
        .tapKey("X_LEFT")
        .tapKey("X_ENTER")
        .tapKey("X_UP")
        .withShift(newMacro().tapKey("X_END"))
        .tapKey("X_LEFT")
        .tapKey("X_LEFT")
        .tapKey("X_LEFT"),
    "regx": newMacro()
        .typeAlphanumeric("//g")
        .tapKey("X_LEFT"),
    "if": newMacro()
        .typeAlphanumeric("if ")
        // Open and closing parenthesis
        .withShift(newMacro().typeAlphanumeric("90 []"))
        .tapKey("X_LEFT")
        .tapKey("X_ENTER")
        .tapKey("X_UP")
        .withShift(newMacro().tapKey("X_END"))
        .tapKey("X_LEFT")
        .tapKey("X_LEFT")
        .tapKey("X_LEFT"),
    "elif": newMacro()
        .typeAlphanumeric("else if ")
        // Open and closing parenthesis
        .withShift(newMacro().typeAlphanumeric("90 []"))
        .tapKey("X_LEFT")
        .tapKey("X_ENTER")
        .tapKey("X_UP")
        .withShift(newMacro().tapKey("X_END"))
        .tapKey("X_LEFT")
        .tapKey("X_LEFT")
        .tapKey("X_LEFT"),
    "else": newMacro()
        .typeAlphanumeric("else ")
        // Open and closing parenthesis
        .withShift(newMacro().tapKey("X_LBRACKET").tapKey("X_RBRACKET"))
        .tapKey("X_LEFT")
        .tapKey("X_ENTER"),
    "expo": newMacro()
        .typeAlphanumeric("export "),
    // .forEach((el) => {})
    "fore": newMacro()
        .typeAlphanumeric(".forEach")
        .withShift(newMacro().typeAlphanumeric("e"))
        .typeAlphanumeric("ach")
        // Open and closing parenthesis
        .withShift(newMacro().typeAlphanumeric("90"))
        .tapKey("X_LEFT")
        .withShift(newMacro().typeAlphanumeric("90"))
        .tapKey("X_LEFT")
        .typeAlphanumeric("el")
        .tapKey("X_RIGHT")
        .tapKey("X_SPACE")
        .tapKey("X_EQUAL")
        // Type >
        .withShift(newMacro().tapKey("X_DOT"))
        .tapKey("X_SPACE")
        .withShift(newMacro().tapKey("X_LBRACKET").tapKey("X_RBRACKET"))
        .tapKey("X_LEFT")
        .tapKey("X_ENTER"),
    "map": newMacro()
        .typeAlphanumeric(".map")
        // Open and closing parenthesis
        .withShift(newMacro().typeAlphanumeric("90"))
        .tapKey("X_LEFT")
        .withShift(newMacro().typeAlphanumeric("90"))
        .tapKey("X_LEFT")
        .typeAlphanumeric("el")
        .tapKey("X_RIGHT")
        .typeAlphanumeric(" =")
        // Type >
        .withShift(newMacro().tapKey("X_DOT"))
        .tapKey("X_SPACE")
        .withShift(newMacro().tapKey("X_LBRACKET").tapKey("X_RBRACKET"))
        .tapKey("X_LEFT")
        .typeAlphanumeric("\nreturn "),
    "filt": newMacro()
        .tapKey("X_DOT")
        .typeAlphanumeric("filter")
        // Open and closing parenthesis
        .withShift(newMacro().typeAlphanumeric("90"))
        .tapKey("X_LEFT")
        .withShift(newMacro().typeAlphanumeric("90"))
        .tapKey("X_LEFT")
        .typeAlphanumeric("el")
        .tapKey("X_RIGHT")
        .typeAlphanumeric(" =")
        // Type >
        .withShift(newMacro().tapKey("X_DOT"))
        .withShift(newMacro().typeAlphanumeric(" []"))
        .tapKey("X_LEFT")
        .typeAlphanumeric("\nreturn "),
    "func": newMacro()
        .typeAlphanumeric("function ")
        .withShift(newMacro().typeAlphanumeric("90 []"))
        .tapKey("X_LEFT")
        .typeAlphanumeric("\n")
        .tapKey("X_UP")
        .tapKey("X_END")
        .tapKey("X_LEFT")
        .tapKey("X_LEFT")
        .tapKey("X_LEFT")
        .withShift(newMacro().typeAlphanumeric("; ")),
    "type": newMacro()
        .typeAlphanumeric("type "),
    "awai": newMacro()
        .typeAlphanumeric("await "),
    "asyn": newMacro()
        .typeAlphanumeric("async "),
    "bool": newMacro()
        .typeAlphanumeric("boolean"),
    "inte": newMacro()
        .typeAlphanumeric("interface "),
    "date": newMacro()
        .typeAlphanumeric("Date"),
    "prom": newMacro()
        // Type a capital P
        .typeAlphanumeric("Promise")
        // Shift for a <>
        .withShift(newMacro().tapKey("X_COMMA").tapKey("X_DOT"))
        .tapKey("X_LEFT"),
    "numb": newMacro().typeAlphanumeric("number"),
    "stri": newMacro().typeAlphanumeric("string"),
    //*/
}

processAll(macroExtensions, SOURCE_DIR)