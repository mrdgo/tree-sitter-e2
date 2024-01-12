(identifier) @variable

; function
(function_definition
  (identifier) @function)

(function_call
  (identifier) @function.call)

((identifier) @function.builtin
    (#any-of? @function.builtin
     "writeChar"
     "readChar"
     "writeInt"
     "readInt"
     "writeReal"
     "readReal"
     "exit"
     )
 )

(parameter
  (identifier) @parameter)

(variable_declaration
  (identifier) @variable)

(number) @constant

[
 "+"
 "-"
 "*"
 "/"
 "<"
 ">"
 "<="
 ">="
 "=="
 "!="
 ":="
 ] @operator

[
 "or"
 "and"
 ] @keyword.operator

[
 "func"
 ] @keyword.function

[
 "return"
 ] @keyword.return

[
 "if"
 "then"
 "else"
 ] @conditional

[
 "while"
 ] @repeat

[
 "as"
 "end"
 ] @keyword

["(" ")" "[" "]"] @punctuation.bracket

[";"] @punctuation.delimiter

[
 "int"
 "real"
 ] @type.builtin

[
 "var"
 ] @storageclass

