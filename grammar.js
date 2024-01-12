const PREC = {
  // inspired by
  // https://introcs.cs.princeton.edu/java/11precedence/
  COMMENT: 0,      // //  /*  */
  ASSIGN: 1,       // :=
  DECL: 2,
  ELEMENT_VAL: 2,
  OR: 4,
  AND: 5,
  EQUALITY: 9,     // ==  !=
  GENERIC: 10,
  REL: 10,         // <  <=  >  >=
  ADD: 12,         // +  -
  MULT: 13,        // *  /  %
  CAST: 14,        // (Type)
  ARRAY: 16,       // [Index]
  PARENS: 16,      // (Expression)
};

module.exports = grammar({
    name: "e2",
    rules: {
        source_file: $ => repeat($._definition),

        _definition: $ => choice(
            $.function_definition,
            $.variable_declaration
        ),

        function_definition: $ => seq(
            "func",
            $.identifier,
            $.parameter_list,
            optional(seq(":", $.primitive_type)),
            $.block,
            "end"
        ),

        parameter_list: $ => seq(
            "(",
            optional($.parameters),
            ")"
        ),

        parameters: $ => seq(
            $.parameter,
            optional(seq(",", $.parameters))
        ),

        parameter: $ => seq(
            $.identifier,
            ":",
            $.primitive_type
        ),

        variable_declaration: $ => seq(
            "var",
            $.identifier,
            ":",
            choice($.primitive_type, $.array_type),
            ";"
        ),

        primitive_type: $ => choice("int", "real"),

        array_type: $ => seq(
            $.primitive_type,
            repeat1($._brack_expr)
        ),

        block: $ => seq(
            optional(repeat($.variable_declaration)),
            repeat1($.statement),
        ),

        statement: $ => choice(
            $.while,
            $.return_statement,
            $.if,
            $.function_call,
            $.assignment,
        ),

        while: $ => seq(
            "while",
            $.expression,
            "do",
            $.block,
            "end",
        ),

        if: $ => seq(
            "if",
            $.expression,
            "then",
            $.block,
            optional(seq("else", $.block)),
            "end",
        ),

        expression: $ => choice(
            seq("(", $._expr, ")"),
            $._expr
        ),

        _expr: $ => choice(
            $.type_cast,
            $.identifier,
            $.function_call,
            $.number,
            $.binary_expression,
            $.array_access,
        ),

        identifier: $ => /[a-zA-Z][a-zA-Z0-9]*/,

        return_statement: $ => prec(1, seq(
            "return",
            $.expression,
            ";"
        )),

        number: $ => /[0-9]+(\.[0-9]*)?/,

        type_cast: $ => seq(
            $.expression,
            "as",
            $.primitive_type
        ),

        function_call: $ => seq(
            $.identifier,
            "(",
            optional($.arguments),
            ")"
        ),

        arguments: $ => seq(
            $.expression,
            optional(seq(",", $.arguments))
        ),


        binary_expression: $ => choice(
          ...[
            ['>', PREC.REL],
            ['<', PREC.REL],
            ['>=', PREC.REL],
            ['<=', PREC.REL],
            ['==', PREC.EQUALITY],
            ['!=', PREC.EQUALITY],
            ['and', PREC.AND],
            ['or', PREC.OR],
            ['+', PREC.ADD],
            ['-', PREC.ADD],
            ['*', PREC.MULT],
            ['/', PREC.MULT],
          ].map(([operator, precedence]) =>
            prec.left(precedence, seq(
              field('left', $.expression),
              field('operator', operator),
              field('right', $.expression)
            ))
          )),

        array_access: $ => seq(
            $.identifier,
            repeat1($._brack_expr),
        ),

        _brack_expr: $ => seq(
            "[",
            $.expression,
            "]",
        ),

        assignment: $ => prec(1, seq(
            choice($.identifier, $.array_access),
            ":=",
            $.expression,
            ";"
        )),
    }
})
