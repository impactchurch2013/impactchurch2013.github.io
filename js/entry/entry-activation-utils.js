export async function runStandaloneEntryDiagnostics({
  documentObj,
  windowObj,
  mountStandaloneShellFn,
  createStatusControllerFn,
  createStatusControllerArgs,
  runDiagnosticsFn,
  diagnosticsArgs
}){
  mountStandaloneShellFn(documentObj, windowObj);
  const statusController = createStatusControllerFn(createStatusControllerArgs);

  await runDiagnosticsFn({
    ...diagnosticsArgs,
    statusController
  });
}
