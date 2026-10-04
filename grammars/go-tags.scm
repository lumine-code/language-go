(package_clause (package_identifier) @name) @definition.module
(function_declaration name: (identifier) @name) @definition.function
(method_declaration name: (field_identifier) @name) @definition.method
(type_spec name: (type_identifier) @name type: (struct_type)) @definition.struct
(type_spec name: (type_identifier) @name type: (interface_type)) @definition.interface
(type_spec name: (type_identifier) @name
  (#is-not? test.typeAt "nextNamedSibling struct_type interface_type")) @definition.type
(type_alias name: (type_identifier) @name) @definition.type
(const_spec name: (identifier) @name) @definition.constant
(var_spec name: (identifier) @name) @definition.variable
(field_declaration name: (field_identifier) @name @definition.field)
(method_elem name: (field_identifier) @name) @definition.method
