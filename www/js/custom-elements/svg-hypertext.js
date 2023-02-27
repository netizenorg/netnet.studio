/* global HTMLElement NNE */
class SvgHypertext extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 439 289" xml:space="preserve" style="width: 60%; margin: 10px auto; display: block;">
    <defs id="defs1025">
    <marker inkscape:stockid="Arrow1Lend" orient="auto" refY="0.0" refX="0.0" id="Arrow1Lend" style="overflow:visible;" inkscape:isstock="true">
    <path id="path2184" d="M 0.0,0.0 L 5.0,-5.0 L -12.5,0.0 L 5.0,5.0 L 0.0,0.0 z " style="fill-rule:evenodd;stroke:${this.c[0]};stroke-width:1pt;stroke-opacity:1;fill:${this.c[0]};fill-opacity:1" transform="scale(0.8) rotate(180) translate(12.5,0)"></path>
    </marker>
    <marker inkscape:stockid="Arrow1Lend" orient="auto" refY="0" refX="0" id="Arrow1Lend-1" style="overflow:visible" inkscape:isstock="true">
    <path inkscape:connector-curvature="0" id="path2184-8" d="M 0,0 5,-5 -12.5,0 5,5 Z" style="fill:${this.c[0]};fill-opacity:1;fill-rule:evenodd;stroke:${this.c[0]};stroke-width:1.00000003pt;stroke-opacity:1" transform="matrix(-0.8,0,0,-0.8,-10,0)"></path>
    </marker>
    <marker inkscape:stockid="Arrow1Lend" orient="auto" refY="0" refX="0" id="Arrow1Lend-7" style="overflow:visible" inkscape:isstock="true">
    <path inkscape:connector-curvature="0" id="path2184-6" d="M 0,0 5,-5 -12.5,0 5,5 Z" style="fill:${this.c[0]};fill-opacity:1;fill-rule:evenodd;stroke:${this.c[0]};stroke-width:1.00000003pt;stroke-opacity:1" transform="matrix(-0.8,0,0,-0.8,-10,0)"></path>
    </marker>
    <marker inkscape:stockid="Arrow1Lend" orient="auto" refY="0" refX="0" id="Arrow1Lend-7-9" style="overflow:visible" inkscape:isstock="true">
    <path inkscape:connector-curvature="0" id="path2184-6-6" d="M 0,0 5,-5 -12.5,0 5,5 Z" style="fill:${this.c[0]};fill-opacity:1;fill-rule:evenodd;stroke:${this.c[0]};stroke-width:1.00000003pt;stroke-opacity:1" transform="matrix(-0.8,0,0,-0.8,-10,0)"></path>
    </marker>
    <marker inkscape:stockid="Arrow1Lend" orient="auto" refY="0" refX="0" id="Arrow1Lend-7-96" style="overflow:visible" inkscape:isstock="true">
    <path inkscape:connector-curvature="0" id="path2184-6-9" d="M 0,0 5,-5 -12.5,0 5,5 Z" style="fill:${this.c[0]};fill-opacity:1;fill-rule:evenodd;stroke:${this.c[0]};stroke-width:1.00000003pt;stroke-opacity:1" transform="matrix(-0.8,0,0,-0.8,-10,0)"></path>
    </marker>
    <marker inkscape:stockid="Arrow1Lend" orient="auto" refY="0" refX="0" id="Arrow1Lend-7-5" style="overflow:visible" inkscape:isstock="true">
    <path inkscape:connector-curvature="0" id="path2184-6-60" d="M 0,0 5,-5 -12.5,0 5,5 Z" style="fill:${this.c[0]};fill-opacity:1;fill-rule:evenodd;stroke:${this.c[0]};stroke-width:1.00000003pt;stroke-opacity:1" transform="matrix(-0.8,0,0,-0.8,-10,0)"></path>
    </marker>
    <marker inkscape:stockid="Arrow1Lend" orient="auto" refY="0" refX="0" id="Arrow1Lend-7-2" style="overflow:visible" inkscape:isstock="true">
    <path inkscape:connector-curvature="0" id="path2184-6-7" d="M 0,0 5,-5 -12.5,0 5,5 Z" style="fill:${this.c[0]};fill-opacity:1;fill-rule:evenodd;stroke:${this.c[0]};stroke-width:1.00000003pt;stroke-opacity:1" transform="matrix(-0.8,0,0,-0.8,-10,0)"></path>
    </marker>
    <marker inkscape:stockid="Arrow1Lend" orient="auto" refY="0" refX="0" id="Arrow1Lend-7-6" style="overflow:visible" inkscape:isstock="true">
    <path inkscape:connector-curvature="0" id="path2184-6-3" d="M 0,0 5,-5 -12.5,0 5,5 Z" style="fill:${this.c[0]};fill-opacity:1;fill-rule:evenodd;stroke:${this.c[0]};stroke-width:1.00000003pt;stroke-opacity:1" transform="matrix(-0.8,0,0,-0.8,-10,0)"></path>
    </marker>
    <marker inkscape:stockid="Arrow1Lend" orient="auto" refY="0" refX="0" id="Arrow1Lend-7-4" style="overflow:visible" inkscape:isstock="true">
    <path inkscape:connector-curvature="0" id="path2184-6-36" d="M 0,0 5,-5 -12.5,0 5,5 Z" style="fill:${this.c[0]};fill-opacity:1;fill-rule:evenodd;stroke:${this.c[0]};stroke-width:1.00000003pt;stroke-opacity:1" transform="matrix(-0.8,0,0,-0.8,-10,0)"></path>
    </marker>
    </defs>
    <sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="3440" inkscape:window-height="1376" id="namedview1023" showgrid="false" showguides="true" inkscape:guide-bbox="true" inkscape:zoom="2.2550102" inkscape:cx="201.88461" inkscape:cy="153.52901" inkscape:window-x="2560" inkscape:window-y="27" inkscape:window-maximized="1" inkscape:current-layer="svg1021">
    <sodipodi:guide position="263.87036,261.67536" orientation="0,1" id="guide2165" inkscape:locked="false"></sodipodi:guide>
    <sodipodi:guide position="242.15554,271.78804" orientation="1,0" id="guide2169" inkscape:locked="false"></sodipodi:guide>
    </sodipodi:namedview>
    <g id="g1766">
    <rect y="21.595449" x="117.07264" height="104.65585" width="78.048424" id="rect1574" style="opacity:1;vector-effect:none;fill:${this.c[1]};fill-opacity:1;stroke:${this.c[2]};stroke-width:2;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"></rect>
    <path inkscape:connector-curvature="0" id="path1584" d="m 119.95511,26.92138 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8" d="m 119.95511,30.672987 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1" d="m 119.95511,34.446812 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2" d="m 119.95511,38.22064 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9" d="m 119.95511,41.990025 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88" d="m 119.95511,45.542127 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-6" d="m 119.95511,49.293734 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-8" d="m 119.95511,53.067559 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-2" d="m 119.95511,56.841387 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-0" d="m 119.95511,60.610772 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-2" d="m 119.95511,64.393496 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-4" d="m 119.95511,68.145103 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-9" d="m 119.95511,71.918928 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-8" d="m 119.95511,75.692756 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-1" d="m 119.95511,79.462141 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-5" d="m 119.95511,83.014243 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-6-6" d="m 119.95511,86.76585 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-8-4" d="m 119.95511,90.539675 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-2-6" d="m 119.95511,94.313503 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-0-8" d="m 119.95511,98.082886 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-6" d="m 119.95511,101.87005 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-3" d="m 119.95511,105.62165 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-5" d="m 119.95511,109.39548 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-7" d="m 119.95511,113.16931 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-4" d="m 119.95511,116.93869 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-2" d="m 119.95511,120.49079 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    </g>
    <g transform="translate(-111.56971,120.69162)" id="g1766-2">
    <rect y="21.595449" x="117.07264" height="104.65585" width="78.048424" id="rect1574-0" style="opacity:1;vector-effect:none;fill:${this.c[1]};fill-opacity:1;stroke:${this.c[2]};stroke-width:2;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"></rect>
    <path inkscape:connector-curvature="0" id="path1584-1" d="m 119.95511,26.92138 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-61" d="m 119.95511,30.672987 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-94" d="m 119.95511,34.446812 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-99" d="m 119.95511,38.22064 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-6" d="m 119.95511,41.990025 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-9" d="m 119.95511,45.542127 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-6-4" d="m 119.95511,49.293734 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-8-2" d="m 119.95511,53.067559 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-2-0" d="m 119.95511,56.841387 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-0-2" d="m 119.95511,60.610772 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-2-3" d="m 119.95511,64.393496 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-4-6" d="m 119.95511,68.145103 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-9-8" d="m 119.95511,71.918928 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-8-9" d="m 119.95511,75.692756 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-1-2" d="m 119.95511,79.462141 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-5-8" d="m 119.95511,83.014243 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-6-6-6" d="m 119.95511,86.76585 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-8-4-7" d="m 119.95511,90.539675 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-2-6-3" d="m 119.95511,94.313503 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-0-8-5" d="m 119.95511,98.082886 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-6-3" d="m 119.95511,101.87005 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-3-5" d="m 119.95511,105.62165 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-5-9" d="m 119.95511,109.39548 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-7-5" d="m 119.95511,113.16931 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-4-9" d="m 119.95511,116.93869 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-2-7" d="m 119.95511,120.49079 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    </g>
    <g transform="translate(49.919577,152.67591)" id="g1766-9">
    <rect y="21.595449" x="117.07264" height="104.65585" width="78.048424" id="rect1574-9" style="opacity:1;vector-effect:none;fill:${this.c[1]};fill-opacity:1;stroke:${this.c[2]};stroke-width:2;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"></rect>
    <path inkscape:connector-curvature="0" id="path1584-0" d="m 119.95511,26.92138 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-5" d="m 119.95511,30.672987 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-21" d="m 119.95511,34.446812 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-0" d="m 119.95511,38.22064 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-2" d="m 119.95511,41.990025 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-0" d="m 119.95511,45.542127 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-6-63" d="m 119.95511,49.293734 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-8-6" d="m 119.95511,53.067559 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-2-9" d="m 119.95511,56.841387 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-0-4" d="m 119.95511,60.610772 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-2-8" d="m 119.95511,64.393496 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-4-4" d="m 119.95511,68.145103 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-9-0" d="m 119.95511,71.918928 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-8-8" d="m 119.95511,75.692756 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-1-4" d="m 119.95511,79.462141 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-5-4" d="m 119.95511,83.014243 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-6-6-8" d="m 119.95511,86.76585 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-8-4-2" d="m 119.95511,90.539675 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-2-6-4" d="m 119.95511,94.313503 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-0-8-2" d="m 119.95511,98.082886 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-6-7" d="m 119.95511,101.87005 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-3-7" d="m 119.95511,105.62165 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-5-99" d="m 119.95511,109.39548 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-7-3" d="m 119.95511,113.16931 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-4-98" d="m 119.95511,116.93869 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-2-4" d="m 119.95511,120.49079 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    </g>
    <g transform="translate(179.73815,115.36091)" id="g1766-0">
    <rect y="21.595449" x="117.07264" height="104.65585" width="78.048424" id="rect1574-8" style="opacity:1;vector-effect:none;fill:${this.c[1]};fill-opacity:1;stroke:${this.c[2]};stroke-width:2;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"></rect>
    <path inkscape:connector-curvature="0" id="path1584-05" d="m 119.95511,26.92138 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-9" d="m 119.95511,30.672987 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-0" d="m 119.95511,34.446812 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-91" d="m 119.95511,38.22064 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-8" d="m 119.95511,41.990025 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-28" d="m 119.95511,45.542127 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-6-7" d="m 119.95511,49.293734 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-8-68" d="m 119.95511,53.067559 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-2-4" d="m 119.95511,56.841387 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-0-89" d="m 119.95511,60.610772 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-2-83" d="m 119.95511,64.393496 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-4-7" d="m 119.95511,68.145103 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-9-07" d="m 119.95511,71.918928 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-8-1" d="m 119.95511,75.692756 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-1-9" d="m 119.95511,79.462141 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-5-6" d="m 119.95511,83.014243 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-6-6-3" d="m 119.95511,86.76585 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-8-4-0" d="m 119.95511,90.539675 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-2-6-1" d="m 119.95511,94.313503 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-0-8-4" d="m 119.95511,98.082886 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-6-8" d="m 119.95511,101.87005 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-3-6" d="m 119.95511,105.62165 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-5-6" d="m 119.95511,109.39548 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-7-6" d="m 119.95511,113.16931 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-4-6" d="m 119.95511,116.93869 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-2-1" d="m 119.95511,120.49079 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    </g>
    <g transform="translate(235.24029,49.824481)" id="g1766-7">
    <rect y="21.595449" x="117.07264" height="104.65585" width="78.048424" id="rect1574-82" style="opacity:1;vector-effect:none;fill:${this.c[1]};fill-opacity:1;stroke:${this.c[2]};stroke-width:2;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"></rect>
    <path inkscape:connector-curvature="0" id="path1584-9" d="m 119.95511,26.92138 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-65" d="m 119.95511,30.672987 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-943" d="m 119.95511,34.446812 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-78" d="m 119.95511,38.22064 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-28" d="m 119.95511,41.990025 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-8" d="m 119.95511,45.542127 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-6-76" d="m 119.95511,49.293734 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-8-0" d="m 119.95511,53.067559 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-2-49" d="m 119.95511,56.841387 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-0-1" d="m 119.95511,60.610772 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-2-2" d="m 119.95511,64.393496 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-4-2" d="m 119.95511,68.145103 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-9-2" d="m 119.95511,71.918928 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-8-4" d="m 119.95511,75.692756 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-1-6" d="m 119.95511,79.462141 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-5-0" d="m 119.95511,83.014243 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-6-6-2" d="m 119.95511,86.76585 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-8-4-3" d="m 119.95511,90.539675 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-2-6-9" d="m 119.95511,94.313503 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-0-8-8" d="m 119.95511,98.082886 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-6-6" d="m 119.95511,101.87005 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-3-8" d="m 119.95511,105.62165 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-5-69" d="m 119.95511,109.39548 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-7-7" d="m 119.95511,113.16931 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-4-2" d="m 119.95511,116.93869 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-2-6" d="m 119.95511,120.49079 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    </g>
    <g transform="translate(133.95672,-10.694805)" id="g1766-8">
    <rect y="21.595449" x="117.07264" height="104.65585" width="78.048424" id="rect1574-89" style="opacity:1;vector-effect:none;fill:${this.c[1]};fill-opacity:1;stroke:${this.c[2]};stroke-width:2;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"></rect>
    <path inkscape:connector-curvature="0" id="path1584-881" d="m 119.95511,26.92138 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-68" d="m 119.95511,30.672987 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-04" d="m 119.95511,34.446812 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-84" d="m 119.95511,38.22064 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-42" d="m 119.95511,41.990025 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-96" d="m 119.95511,45.542127 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-6-45" d="m 119.95511,49.293734 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-8-5" d="m 119.95511,53.067559 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-2-47" d="m 119.95511,56.841387 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-0-0" d="m 119.95511,60.610772 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-2-5" d="m 119.95511,64.393496 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-4-76" d="m 119.95511,68.145103 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-9-4" d="m 119.95511,71.918928 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-8-3" d="m 119.95511,75.692756 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-1-5" d="m 119.95511,79.462141 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-5-3" d="m 119.95511,83.014243 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-6-6-7" d="m 119.95511,86.76585 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-8-4-32" d="m 119.95511,90.539675 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-2-6-8" d="m 119.95511,94.313503 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-0-8-3" d="m 119.95511,98.082886 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-6-0" d="m 119.95511,101.87005 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-3-86" d="m 119.95511,105.62165 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-5-697" d="m 119.95511,109.39548 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-7-1" d="m 119.95511,113.16931 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-8-1-2-9-4-93" d="m 119.95511,116.93869 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    <path inkscape:connector-curvature="0" id="path1584-88-2-71" d="m 119.95511,120.49079 h 71.6183" style="fill:none;stroke:${this.c[2]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path>
    </g>
    <rect style="opacity:1;vector-effect:none;fill:${this.c[0]};fill-opacity:1;stroke:none;stroke-width:1.96214163;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" id="rect2104" width="21.730499" height="6.2714286" x="124.28403" y="38.653389"></rect>
    <rect style="opacity:1;vector-effect:none;fill:${this.c[0]};fill-opacity:1;stroke:none;stroke-width:1.96214163;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" id="rect2104-2" width="21.730499" height="6.2714286" x="158.92975" y="95.017868"></rect>
    <rect style="opacity:1;vector-effect:none;fill:${this.c[0]};fill-opacity:1;stroke:none;stroke-width:1.96214163;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" id="rect2104-3" width="21.730499" height="6.2714286" x="268.84048" y="35.439281"></rect>
    <rect style="opacity:1;vector-effect:none;fill:${this.c[0]};fill-opacity:1;stroke:none;stroke-width:1.96214163;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" id="rect2104-5" width="21.730499" height="6.2714286" x="366.04761" y="118.61213"></rect>
    <rect style="opacity:1;vector-effect:none;fill:${this.c[0]};fill-opacity:1;stroke:none;stroke-width:1.96214163;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" id="rect2104-7" width="21.730499" height="6.2714286" x="301.69327" y="157.97807"></rect>
    <rect style="opacity:1;vector-effect:none;fill:${this.c[0]};fill-opacity:1;stroke:none;stroke-width:1.96214163;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" id="rect2104-0" width="21.730499" height="6.2714286" x="343.03833" y="199.005"></rect>
    <rect style="opacity:1;vector-effect:none;fill:${this.c[0]};fill-opacity:1;stroke:none;stroke-width:1.96214163;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" id="rect2104-26" width="21.730499" height="6.2714286" x="309.1344" y="217.81929"></rect>
    <rect style="opacity:1;vector-effect:none;fill:${this.c[0]};fill-opacity:1;stroke:none;stroke-width:1.96214163;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" id="rect2104-07" width="21.730499" height="6.2714286" x="196.33688" y="198.84821"></rect>
    <rect style="opacity:1;vector-effect:none;fill:${this.c[0]};fill-opacity:1;stroke:none;stroke-width:1.96214163;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" id="rect2104-37" width="21.730499" height="6.2714286" x="210.20261" y="251.21463"></rect>
    <path style="fill:none;stroke:${this.c[0]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;marker-end:url(#Arrow1Lend)" d="M 145.67561,41.772742 253.91183,23.752007" id="path2179" inkscape:connector-curvature="0" sodipodi:nodetypes="cc"></path>
    <path style="fill:none;stroke:${this.c[0]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;marker-end:url(#Arrow1Lend-1)" d="m 290.57098,38.379997 86.50683,37.411387" id="path2179-4" inkscape:connector-curvature="0" sodipodi:nodetypes="cc"></path>
    <path style="fill:none;stroke:${this.c[0]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;marker-end:url(#Arrow1Lend-7)" d="m 366.04766,121.59107 -42.09568,20.11656" id="path2179-8" inkscape:connector-curvature="0" sodipodi:nodetypes="cc"></path>
    <path style="fill:none;stroke:${this.c[0]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;marker-end:url(#Arrow1Lend-7-9)" d="m 364.76883,202.1789 34.17893,-36.64593" id="path2179-8-3" inkscape:connector-curvature="0" sodipodi:nodetypes="cc"></path>
    <path style="fill:none;stroke:${this.c[0]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;marker-end:url(#Arrow1Lend-7-96)" d="M 301.57474,161.05983 191.57341,113.16931" id="path2179-8-7" inkscape:connector-curvature="0" sodipodi:nodetypes="cc"></path>
    <path style="fill:none;stroke:${this.c[0]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;marker-end:url(#Arrow1Lend-7-5)" d="m 309.17267,220.87466 -78.45915,10.80396" id="path2179-8-5" inkscape:connector-curvature="0" sodipodi:nodetypes="cc"></path>
    <path style="fill:none;stroke:${this.c[0]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;marker-end:url(#Arrow1Lend-7-2)" d="M 158.96802,98.07323 80.0037,147.613" id="path2179-8-6" inkscape:connector-curvature="0" sodipodi:nodetypes="cc"></path>
    <path style="fill:none;stroke:${this.c[0]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;marker-end:url(#Arrow1Lend-7-6)" d="M 196.09188,201.82705 150.51336,122.092" id="path2179-8-2" inkscape:connector-curvature="0" sodipodi:nodetypes="cc"></path>
    <path style="fill:none;stroke:${this.c[0]};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;marker-end:url(#Arrow1Lend-7-4)" d="M 210.08409,254.31216 80.0037,203.70586" id="path2179-8-0" inkscape:connector-curvature="0" sodipodi:nodetypes="cc"></path>
    </svg>`
  }

  get colors () {
    return this.c
  }

  set colors (val) {
    if (val instanceof Array) val = val.join(',')
    this.setAttribute('colors', val)
    this.c = val.split(',')
    this.updateHTML()
  }

  static get observedAttributes () {
    return ['colors']
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (newVal !== oldVal) this[attrName] = newVal
  }
}

window.customElements.define('svg-hypertext', SvgHypertext)
