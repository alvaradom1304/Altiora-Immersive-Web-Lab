/* Altiora After Effects creative handoff — ORIGINAL conceptual comp.
 * Run manually in a permitted installed copy of After Effects:
 * File > Scripts > Run Script File...
 * Does not import media, connect to network, save files, or start renders.
 * It creates ONLY a new composition in the open project.
 */
(function () {
  app.beginUndoGroup("Altiora Original Vertical Motion Demo");
  try {
    if (!app.project) { throw new Error("Open or create an After Effects project first."); }
    var comp = app.project.items.addComp("ALTIORA_Concept_9x16_15s",1080,1920,1,15,30);
    comp.bgColor = [0.045,0.045,0.11];
    var main=comp.layers.addText("ALTIORA\rVISUAL STUDIO");
    main.name="TYPE - ORIGINAL CONCEPT";
    main.startTime=0;
    main.inPoint=0;
    main.outPoint=15;
    var p=main.property("ADBE Text Properties").property("ADBE Text Document");
    var d=p.value;
    d.fontSize=112;
    d.applyFill=true;
    d.fillColor=[0.96,0.92,1];
    d.justification=ParagraphJustification.CENTER_JUSTIFY;
    p.setValue(d);
    main.property("Transform").property("Position").setValue([540,860]);
    var opacity=main.property("Transform").property("Opacity");
    opacity.setValueAtTime(0,0);
    opacity.setValueAtTime(0.6,100);
    opacity.setValueAtTime(12.6,100);
    opacity.setValueAtTime(14.3,0);
    var footer=comp.layers.addText("CONCEPTO VISUAL ORIGINAL · NO ES UN PRODUCTO REAL");
    footer.name="LEGAL - CONCEPT";
    footer.property("Transform").property("Position").setValue([540,1780]);
    var prop=footer.property("ADBE Text Properties").property("ADBE Text Document");
    var doc=prop.value;
    doc.fontSize=30;
    doc.fillColor=[0.8,0.72,0.95];
    doc.justification=ParagraphJustification.CENTER_JUSTIFY;
    prop.setValue(doc);
    alert("Altiora: composición conceptual creada. Guardá el proyecto .aep y elegí el Output Module antes de aerender.");
  } catch (error) {
    alert("Altiora no pudo crear la composición: " + error.message);
  } finally {
    app.endUndoGroup();
  }
})();
