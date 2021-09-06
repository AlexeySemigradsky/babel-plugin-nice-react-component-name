import * as babel from "@babel/core";

function NiceReactComponentName({ types }: typeof babel) {
  return {
    visitor: {
      ArrowFunctionExpression(
        path: babel.NodePath<babel.types.ArrowFunctionExpression>
      ) {
        const arrowFunctionExpression = path;
        if (!path.isArrowFunctionExpression()) {
          return;
        }

        const assignmentExpression = path.parentPath;

        const callExpression = assignmentExpression.isAssignmentExpression()
          ? assignmentExpression.parentPath
          : arrowFunctionExpression.parentPath;
        if (!callExpression.isCallExpression()) {
          return;
        }

        const variableDeclarator = callExpression.parentPath;
        if (!variableDeclarator.isVariableDeclarator()) {
          return;
        }

        if (!types.isIdentifier(variableDeclarator.node.id)) {
          return;
        }

        const callee = callExpression.node.callee;

        let calleeName;
        if (types.isIdentifier(callee)) {
          calleeName = callee.name;
        } else if (
          types.isMemberExpression(callee) &&
          types.isIdentifier(callee.object) &&
          types.isIdentifier(callee.property)
        ) {
          calleeName = callee.object.name + "." + callee.property.name;
        } else {
          return;
        }

        if (!["React.memo", "memo", "observer"].includes(calleeName)) {
          return;
        }

        const variableName = variableDeclarator.node.id.name;
        if (!/^[A-Z]/.test(variableName)) {
          return;
        }

        path.replaceWith(
          types.functionExpression(
            types.identifier(variableName),
            path.node.params,
            types.isBlockStatement(path.node.body)
              ? path.node.body
              : types.blockStatement([types.returnStatement(path.node.body)])
          )
        );
      },
    },
  };
}

export default NiceReactComponentName;
