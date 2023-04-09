

export function prepare(newMacro) {

  const macroExtensions = {
    "gg": newMacro()
        .tapKey("X_ENTER")
        .typeAlphanumeric("(gg)")
        .tapKey("X_ENTER"),
  }
  return { macroExtensions }
}