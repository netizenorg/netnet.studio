/* global HTMLElement */
class KeyBoard extends HTMLElement {
  connectedCallback () {
    this.attachShadow({ mode: 'open' })
    /*
      KeyBoard SVG remixed from:
      https://github.com/district10/shuangpin-heatmap/blob/master/svgs/qwerty/pinyinjiajia.svg
    */
    this.shadowRoot.innerHTML = `<svg
   width="821"
   height="281"
   viewBox="0 0 821 281"
   version="1.1"
   id="svg379"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <style
     type="text/css"
     id="style1">.keycap .border { stroke: black; stroke-width: 2; }
.keycap .inner.border { stroke: rgba(0,0,0,.1); }
</style>
  <defs
     id="defs11" />
  <rect
     width="820"
     height="280"
     stroke="#dddddd"
     stroke-width="1"
     fill="#eeeeee"
     opacity="0"
     rx="6"
     id="rect11"
     x="0.5"
     y="0.5" />
  <g
     class="  keycap"
     id="key-tack"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="1"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect12" />
    <!-- Outer Fill -->
    <rect
       x="1"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect13" />
    <!-- Inner Border -->
    <rect
       x="7"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect14" />
    <!-- Inner Fill -->
    <rect
       x="7"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect15" />
  </g>
  <g
     class="  keycap"
     id="key-1"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="55"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect16" />
    <!-- Outer Fill -->
    <rect
       x="55"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect17" />
    <!-- Inner Border -->
    <rect
       x="61"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect18" />
    <!-- Inner Fill -->
    <rect
       x="61"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect19" />
  </g>
  <g
     class="  keycap"
     id="key-2"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="109"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect20" />
    <!-- Outer Fill -->
    <rect
       x="109"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect21" />
    <!-- Inner Border -->
    <rect
       x="115"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect22" />
    <!-- Inner Fill -->
    <rect
       x="115"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect23" />
  </g>
  <g
     class="  keycap"
     id="key-3"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="163"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect24" />
    <!-- Outer Fill -->
    <rect
       x="163"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect25" />
    <!-- Inner Border -->
    <rect
       x="169"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect26" />
    <!-- Inner Fill -->
    <rect
       x="169"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect27" />
  </g>
  <g
     class="  keycap"
     id="key-4"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="217"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect28" />
    <!-- Outer Fill -->
    <rect
       x="217"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect29" />
    <!-- Inner Border -->
    <rect
       x="223"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect30" />
    <!-- Inner Fill -->
    <rect
       x="223"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect31" />
  </g>
  <g
     class="  keycap"
     id="key-5"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="271"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect32" />
    <!-- Outer Fill -->
    <rect
       x="271"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect33" />
    <!-- Inner Border -->
    <rect
       x="277"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect34" />
    <!-- Inner Fill -->
    <rect
       x="277"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect35" />
  </g>
  <g
     class="  keycap"
     id="key-6"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="325"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect36" />
    <!-- Outer Fill -->
    <rect
       x="325"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect37" />
    <!-- Inner Border -->
    <rect
       x="331"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect38" />
    <!-- Inner Fill -->
    <rect
       x="331"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect39" />
  </g>
  <g
     class="  keycap"
     id="key-7"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="379"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect40" />
    <!-- Outer Fill -->
    <rect
       x="379"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect41" />
    <!-- Inner Border -->
    <rect
       x="385"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect42" />
    <!-- Inner Fill -->
    <rect
       x="385"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect43" />
  </g>
  <g
     class="  keycap"
     id="key-8"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="433"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect44" />
    <!-- Outer Fill -->
    <rect
       x="433"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect45" />
    <!-- Inner Border -->
    <rect
       x="439"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect46" />
    <!-- Inner Fill -->
    <rect
       x="439"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect47" />
  </g>
  <g
     class="  keycap"
     id="key-9"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="487"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect48" />
    <!-- Outer Fill -->
    <rect
       x="487"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect49" />
    <!-- Inner Border -->
    <rect
       x="493"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect50" />
    <!-- Inner Fill -->
    <rect
       x="493"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect51" />
  </g>
  <g
     class="  keycap"
     id="key-0"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="541"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect52" />
    <!-- Outer Fill -->
    <rect
       x="541"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect53" />
    <!-- Inner Border -->
    <rect
       x="547"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect54" />
    <!-- Inner Fill -->
    <rect
       x="547"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect55" />
  </g>
  <g
     class="  keycap"
     id="key-minus"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="595"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect56" />
    <!-- Outer Fill -->
    <rect
       x="595"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect57" />
    <!-- Inner Border -->
    <rect
       x="601"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect58" />
    <!-- Inner Fill -->
    <rect
       x="601"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect59" />
  </g>
  <g
     class="  keycap"
     id="key-equals"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="649"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect60" />
    <!-- Outer Fill -->
    <rect
       x="649"
       y="1"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect61" />
    <!-- Inner Border -->
    <rect
       x="655"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect62" />
    <!-- Inner Fill -->
    <rect
       x="655"
       y="4"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect63" />
  </g>
  <g
     class="  keycap"
     id="key-backspace"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="703"
       y="1"
       width="106"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect64" />
    <!-- Outer Fill -->
    <rect
       x="703"
       y="1"
       width="106"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect65" />
    <!-- Inner Border -->
    <rect
       x="709"
       y="4"
       width="94"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect66" />
    <!-- Inner Fill -->
    <rect
       x="709"
       y="4"
       width="94"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect67" />
  </g>
  <g
     class="  keycap"
     id="key-tab"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="1"
       y="55"
       width="79"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect68" />
    <!-- Outer Fill -->
    <rect
       x="1"
       y="55"
       width="79"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect69" />
    <!-- Inner Border -->
    <rect
       x="7"
       y="58"
       width="67"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect70" />
    <!-- Inner Fill -->
    <rect
       x="7"
       y="58"
       width="67"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect71" />
  </g>
  <g
     class="  keycap"
     id="key-q"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="82"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect72" />
    <!-- Outer Fill -->
    <rect
       x="82"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect73" />
    <!-- Inner Border -->
    <rect
       x="88"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect74" />
    <!-- Inner Fill -->
    <rect
       x="88"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect75" />
  </g>
  <g
     class="  keycap"
     id="key-w"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="136"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect76" />
    <!-- Outer Fill -->
    <rect
       x="136"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect77" />
    <!-- Inner Border -->
    <rect
       x="142"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect78" />
    <!-- Inner Fill -->
    <rect
       x="142"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect79" />
  </g>
  <g
     class="  keycap"
     id="key-e"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="190"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect80" />
    <!-- Outer Fill -->
    <rect
       x="190"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect81" />
    <!-- Inner Border -->
    <rect
       x="196"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect82" />
    <!-- Inner Fill -->
    <rect
       x="196"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect83" />
  </g>
  <g
     class="  keycap"
     id="key-r"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="244"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect84" />
    <!-- Outer Fill -->
    <rect
       x="244"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect85" />
    <!-- Inner Border -->
    <rect
       x="250"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect86" />
    <!-- Inner Fill -->
    <rect
       x="250"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect87" />
  </g>
  <g
     class="  keycap"
     id="key-t"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="298"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect88" />
    <!-- Outer Fill -->
    <rect
       x="298"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect89" />
    <!-- Inner Border -->
    <rect
       x="304"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect90" />
    <!-- Inner Fill -->
    <rect
       x="304"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect91" />
  </g>
  <g
     class="  keycap"
     id="key-y"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="352"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect92" />
    <!-- Outer Fill -->
    <rect
       x="352"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect93" />
    <!-- Inner Border -->
    <rect
       x="358"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect94" />
    <!-- Inner Fill -->
    <rect
       x="358"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect95" />
  </g>
  <g
     class="  keycap"
     id="key-u"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="406"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect96" />
    <!-- Outer Fill -->
    <rect
       x="406"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect97" />
    <!-- Inner Border -->
    <rect
       x="412"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect98" />
    <!-- Inner Fill -->
    <rect
       x="412"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect99" />
  </g>
  <g
     class="  keycap"
     id="key-i"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="460"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect100" />
    <!-- Outer Fill -->
    <rect
       x="460"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect101" />
    <!-- Inner Border -->
    <rect
       x="466"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect102" />
    <!-- Inner Fill -->
    <rect
       x="466"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect103" />
  </g>
  <g
     class="  keycap"
     id="key-o"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="514"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect104" />
    <!-- Outer Fill -->
    <rect
       x="514"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect105" />
    <!-- Inner Border -->
    <rect
       x="520"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect106" />
    <!-- Inner Fill -->
    <rect
       x="520"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect107" />
  </g>
  <g
     class="  keycap"
     id="key-p"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="568"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect108" />
    <!-- Outer Fill -->
    <rect
       x="568"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect109" />
    <!-- Inner Border -->
    <rect
       x="574"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect110" />
    <!-- Inner Fill -->
    <rect
       x="574"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect111" />
  </g>
  <g
     class="  keycap"
     id="key-open-bracket"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="622"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect112" />
    <!-- Outer Fill -->
    <rect
       x="622"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect113" />
    <!-- Inner Border -->
    <rect
       x="628"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect114" />
    <!-- Inner Fill -->
    <rect
       x="628"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect115" />
  </g>
  <g
     class="  keycap"
     id="key-close-bracket"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="676"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect116" />
    <!-- Outer Fill -->
    <rect
       x="676"
       y="55"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect117" />
    <!-- Inner Border -->
    <rect
       x="682"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect118" />
    <!-- Inner Fill -->
    <rect
       x="682"
       y="58"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect119" />
  </g>
  <g
     class="  keycap"
     id="key-back-slash"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="730"
       y="55"
       width="79"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect120" />
    <!-- Outer Fill -->
    <rect
       x="730"
       y="55"
       width="79"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect121" />
    <!-- Inner Border -->
    <rect
       x="736"
       y="58"
       width="67"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect122" />
    <!-- Inner Fill -->
    <rect
       x="736"
       y="58"
       width="67"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect123" />
  </g>
  <g
     class="  keycap"
     id="key-cap-lock"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="1"
       y="109"
       width="92.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect124" />
    <!-- Outer Fill -->
    <rect
       x="1"
       y="109"
       width="92.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect125" />
    <!-- Inner Border -->
    <rect
       x="7"
       y="112"
       width="80.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect126" />
    <!-- Inner Fill -->
    <rect
       x="7"
       y="112"
       width="80.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect127" />
  </g>
  <g
     class="  keycap"
     id="key-a"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="95.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect128" />
    <!-- Outer Fill -->
    <rect
       x="95.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect129" />
    <!-- Inner Border -->
    <rect
       x="101.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect130" />
    <!-- Inner Fill -->
    <rect
       x="101.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect131" />
  </g>
  <g
     class="  keycap"
     id="key-s"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="149.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect132" />
    <!-- Outer Fill -->
    <rect
       x="149.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect133" />
    <!-- Inner Border -->
    <rect
       x="155.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect134" />
    <!-- Inner Fill -->
    <rect
       x="155.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect135" />
  </g>
  <g
     class="  keycap"
     id="key-d"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="203.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect136" />
    <!-- Outer Fill -->
    <rect
       x="203.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect137" />
    <!-- Inner Border -->
    <rect
       x="209.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect138" />
    <!-- Inner Fill -->
    <rect
       x="209.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect139" />
  </g>
  <g
     class="  keycap"
     id="key-f"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="257.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect140" />
    <!-- Outer Fill -->
    <rect
       x="257.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect141" />
    <!-- Inner Border -->
    <rect
       x="263.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect142" />
    <!-- Inner Fill -->
    <rect
       x="263.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect143" />
  </g>
  <g
     class="  keycap"
     id="key-g"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="311.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect144" />
    <!-- Outer Fill -->
    <rect
       x="311.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect145" />
    <!-- Inner Border -->
    <rect
       x="317.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect146" />
    <!-- Inner Fill -->
    <rect
       x="317.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect147" />
  </g>
  <g
     class="  keycap"
     id="key-h"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="365.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect148" />
    <!-- Outer Fill -->
    <rect
       x="365.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect149" />
    <!-- Inner Border -->
    <rect
       x="371.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect150" />
    <!-- Inner Fill -->
    <rect
       x="371.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect151" />
  </g>
  <g
     class="  keycap"
     id="key-j"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="419.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect152" />
    <!-- Outer Fill -->
    <rect
       x="419.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect153" />
    <!-- Inner Border -->
    <rect
       x="425.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect154" />
    <!-- Inner Fill -->
    <rect
       x="425.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect155" />
  </g>
  <g
     class="  keycap"
     id="key-k"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="473.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect156" />
    <!-- Outer Fill -->
    <rect
       x="473.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect157" />
    <!-- Inner Border -->
    <rect
       x="479.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect158" />
    <!-- Inner Fill -->
    <rect
       x="479.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect159" />
  </g>
  <g
     class="  keycap"
     id="key-l"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="527.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect160" />
    <!-- Outer Fill -->
    <rect
       x="527.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect161" />
    <!-- Inner Border -->
    <rect
       x="533.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect162" />
    <!-- Inner Fill -->
    <rect
       x="533.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect163" />
  </g>
  <g
     class="  keycap"
     id="key-semi"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="581.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect164" />
    <!-- Outer Fill -->
    <rect
       x="581.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect165" />
    <!-- Inner Border -->
    <rect
       x="587.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect166" />
    <!-- Inner Fill -->
    <rect
       x="587.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect167" />
  </g>
  <g
     class="  keycap"
     id="key-quote"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="635.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect168" />
    <!-- Outer Fill -->
    <rect
       x="635.5"
       y="109"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect169" />
    <!-- Inner Border -->
    <rect
       x="641.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect170" />
    <!-- Inner Fill -->
    <rect
       x="641.5"
       y="112"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect171" />
  </g>
  <g
     class="  keycap"
     id="key-enter"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="689.5"
       y="109"
       width="119.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect172" />
    <!-- Outer Fill -->
    <rect
       x="689.5"
       y="109"
       width="119.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect173" />
    <!-- Inner Border -->
    <rect
       x="695.5"
       y="112"
       width="107.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect174" />
    <!-- Inner Fill -->
    <rect
       x="695.5"
       y="112"
       width="107.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect175" />
  </g>
  <g
     class="  keycap"
     id="key-shift"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="1"
       y="163"
       width="119.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect176" />
    <!-- Outer Fill -->
    <rect
       x="1"
       y="163"
       width="119.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect177" />
    <!-- Inner Border -->
    <rect
       x="7"
       y="166"
       width="107.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect178" />
    <!-- Inner Fill -->
    <rect
       x="7"
       y="166"
       width="107.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect179" />
  </g>
  <g
     class="  keycap"
     id="key-z"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="122.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect180" />
    <!-- Outer Fill -->
    <rect
       x="122.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect181" />
    <!-- Inner Border -->
    <rect
       x="128.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect182" />
    <!-- Inner Fill -->
    <rect
       x="128.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect183" />
  </g>
  <g
     class="  keycap"
     id="key-x"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="176.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect184" />
    <!-- Outer Fill -->
    <rect
       x="176.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect185" />
    <!-- Inner Border -->
    <rect
       x="182.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect186" />
    <!-- Inner Fill -->
    <rect
       x="182.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect187" />
  </g>
  <g
     class="  keycap"
     id="key-c"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="230.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect188" />
    <!-- Outer Fill -->
    <rect
       x="230.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect189" />
    <!-- Inner Border -->
    <rect
       x="236.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect190" />
    <!-- Inner Fill -->
    <rect
       x="236.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect191" />
  </g>
  <g
     class="  keycap"
     id="key-v"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="284.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect192" />
    <!-- Outer Fill -->
    <rect
       x="284.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect193" />
    <!-- Inner Border -->
    <rect
       x="290.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect194" />
    <!-- Inner Fill -->
    <rect
       x="290.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect195" />
  </g>
  <g
     class="  keycap"
     id="key-b"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="338.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect196" />
    <!-- Outer Fill -->
    <rect
       x="338.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect197" />
    <!-- Inner Border -->
    <rect
       x="344.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect198" />
    <!-- Inner Fill -->
    <rect
       x="344.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect199" />
  </g>
  <g
     class="  keycap"
     id="key-n"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="392.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect200" />
    <!-- Outer Fill -->
    <rect
       x="392.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect201" />
    <!-- Inner Border -->
    <rect
       x="398.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect202" />
    <!-- Inner Fill -->
    <rect
       x="398.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect203" />
  </g>
  <g
     class="  keycap"
     id="key-m"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="446.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect204" />
    <!-- Outer Fill -->
    <rect
       x="446.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect205" />
    <!-- Inner Border -->
    <rect
       x="452.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect206" />
    <!-- Inner Fill -->
    <rect
       x="452.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect207" />
  </g>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="466.05511"
     y="182.64998"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text287">M</text>
  <g
     class="  keycap"
     id="key-comma"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="500.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect208" />
    <!-- Outer Fill -->
    <rect
       x="500.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect209" />
    <!-- Inner Border -->
    <rect
       x="506.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect210" />
    <!-- Inner Fill -->
    <rect
       x="506.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect211" />
  </g>
  <g
     class="  keycap"
     id="key-period"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="554.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect212" />
    <!-- Outer Fill -->
    <rect
       x="554.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect213" />
    <!-- Inner Border -->
    <rect
       x="560.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect214" />
    <!-- Inner Fill -->
    <rect
       x="560.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect215" />
  </g>
  <g
     class="  keycap"
     id="key-fwd-slash"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="608.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect216" />
    <!-- Outer Fill -->
    <rect
       x="608.5"
       y="163"
       width="52"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect217" />
    <!-- Inner Border -->
    <rect
       x="614.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect218" />
    <!-- Inner Fill -->
    <rect
       x="614.5"
       y="166"
       width="40"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect219" />
  </g>
  <g
     class="  keycap"
     id="key-shift-r"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="662.5"
       y="163"
       width="146.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect220" />
    <!-- Outer Fill -->
    <rect
       x="662.5"
       y="163"
       width="146.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect221" />
    <!-- Inner Border -->
    <rect
       x="668.5"
       y="166"
       width="134.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect222" />
    <!-- Inner Fill -->
    <rect
       x="668.5"
       y="166"
       width="134.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect223" />
  </g>
  <g
     class="  keycap"
     id="key-ctrl"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="1"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect224" />
    <!-- Outer Fill -->
    <rect
       x="1"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect225" />
    <!-- Inner Border -->
    <rect
       x="7"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect226" />
    <!-- Inner Fill -->
    <rect
       x="7"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect227" />
  </g>
  <g
     class="  keycap"
     id="key-opt"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="68.5"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect228" />
    <!-- Outer Fill -->
    <rect
       x="68.5"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect229" />
    <!-- Inner Border -->
    <rect
       x="74.5"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect230" />
    <!-- Inner Fill -->
    <rect
       x="74.5"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect231" />
  </g>
  <g
     class="  keycap"
     id="key-cmd"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="136"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect232" />
    <!-- Outer Fill -->
    <rect
       x="136"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect233" />
    <!-- Inner Border -->
    <rect
       x="142"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect234" />
    <!-- Inner Fill -->
    <rect
       x="142"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect235" />
  </g>
  <g
     class="  keycap"
     id="key-spacebar"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="203.5"
       y="217"
       width="335.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect236" />
    <!-- Outer Fill -->
    <rect
       x="203.5"
       y="217"
       width="335.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect237" />
    <!-- Inner Border -->
    <rect
       x="209.5"
       y="220"
       width="323.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect238" />
    <!-- Inner Fill -->
    <rect
       x="209.5"
       y="220"
       width="323.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect239" />
  </g>
  <g
     class="  keycap"
     id="key-left"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="541"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect240" />
    <!-- Outer Fill -->
    <rect
       x="541"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect241" />
    <!-- Inner Border -->
    <rect
       x="547"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect242" />
    <!-- Inner Fill -->
    <rect
       x="547"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect243" />
  </g>
  <g
     class="  keycap"
     id="key-up"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="608.5"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect244" />
    <!-- Outer Fill -->
    <rect
       x="608.5"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect245" />
    <!-- Inner Border -->
    <rect
       x="614.5"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect246" />
    <!-- Inner Fill -->
    <rect
       x="614.5"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect247" />
  </g>
  <g
     class="  keycap"
     id="key-down"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="676"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect248" />
    <!-- Outer Fill -->
    <rect
       x="676"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect249" />
    <!-- Inner Border -->
    <rect
       x="682"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect250" />
    <!-- Inner Fill -->
    <rect
       x="682"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect251" />
  </g>
  <g
     class="  keycap"
     id="key-right"
     transform="translate(5.5,5.5)">
    <!-- Outer Border -->
    <rect
       x="743.5"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       class="outer border"
       id="rect252" />
    <!-- Outer Fill -->
    <rect
       x="743.5"
       y="217"
       width="65.5"
       height="52"
       rx="5"
       fill="#cccccc33"
       id="rect253" />
    <!-- Inner Border -->
    <rect
       x="749.5"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       class="inner border"
       id="rect254" />
    <!-- Inner Fill -->
    <rect
       x="749.5"
       y="220"
       width="53.5"
       height="40"
       rx="5"
       fill="#fcfcfc33"
       id="rect255" />
  </g>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="100.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text257">Q</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="154.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text258">W</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="208.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text259">E</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="262.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text260">R</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="316.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text261">T</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="370.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text262">Y</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="424.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text263">U</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="478.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text264">I</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="532.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text265">O</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="586.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text266">P</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="640.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text267">[</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="694.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text268">]</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="748.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text269">\\</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="114"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text270">A</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="168"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text271">S</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="222"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text272">D</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="276"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text273">F</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="330"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text274">G</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="384"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text275">H</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="438"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text276">J</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="492"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text277">K</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="546"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text278">L</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="600"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text279">;</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="654"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text280">'</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="141"
     y="182.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text281">Z</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="195"
     y="182.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text282">X</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="249"
     y="182.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text283">C</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="303"
     y="182.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text284">V</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="357"
     y="182.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text285">B</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="411"
     y="182.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text286">N</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="519"
     y="182.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text288">,</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="573"
     y="182.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text289">.</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="627"
     y="182.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text290">/</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="19.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text291">~</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="73.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text292">!</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="127.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text293">@</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="181.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text294">#</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="235.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text295">$</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="289.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text296">%</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="343.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text297">^</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="397.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text298">&amp;</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="451.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text299">*</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="505.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text300">(</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="559.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text301">)</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="613.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text302">_</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="667.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text303">+</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="19.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text304">\`</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="73.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text305">1</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="127.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text306">2</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="181.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text307">3</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="235.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text308">4</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="289.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text309">5</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="343.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text310">6</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="397.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text311">7</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="451.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text312">8</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="505.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text313">9</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="559.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text314">0</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="613.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text315">-</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="667.5"
     y="30.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text316">=</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="721.5"
     y="20.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text317">BACKSPACE</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="19.5"
     y="74.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text318">TAB</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="19.5"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text319">CAPS LOCK</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="708"
     y="128.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text320">ENTER</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="19.5"
     y="182.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text321">SHIFT (L)</text>
  <text
     alignment-baseline="hanging"
     text-anchor="start"
     x="681"
     y="182.5"
     fill="#000000"
     font-size="10px"
     font-family="monospace"
     id="text322">SHIFT (R)</text>
  <text
     xml:space="preserve"
     style="font-size:10.6667px;fill:#ff0000;stroke:#ff0024;stroke-width:56.1227;stroke-linecap:square"
     x="17.684353"
     y="239.20082"
     id="text379"><tspan
       id="tspan379"
       x="17.684353"
       y="239.20082"
       style="font-size:10.6667px;fill:#000000;fill-opacity:1;stroke:none">Ctrl</tspan></text>
  <text
     xml:space="preserve"
     style="font-size:10.6667px;fill:#ff0000;stroke:#ff0024;stroke-width:56.1227;stroke-linecap:square"
     x="152.66562"
     y="239.53076"
     id="text379-0"><tspan
       id="tspan379-4"
       x="152.66562"
       y="239.53076"
       style="font-size:10.6667px;fill:#000000;fill-opacity:1;stroke:none">Cmd</tspan></text>
  <text
     xml:space="preserve"
     style="font-size:16px;fill:#ff0000;stroke:#ff0024;stroke-width:56.1227;stroke-linecap:square"
     x="557.96204"
     y="239.97455"
     id="text379-0-7"><tspan
       id="tspan379-4-1"
       x="557.96204"
       y="239.97455"
       style="font-size:16px;fill:#000000;fill-opacity:1;stroke:none">⭠</tspan></text>
  <text
     xml:space="preserve"
     style="font-size:16px;fill:#ff0000;stroke:#ff0024;stroke-width:56.1227;stroke-linecap:square"
     x="230.73309"
     y="-623.67786"
     id="text379-0-7-6"
     transform="rotate(90)"><tspan
       id="tspan379-4-1-0"
       x="230.73309"
       y="-623.67786"
       style="font-size:16px;fill:#000000;fill-opacity:1;stroke:none">⭠</tspan></text>
  <text
     xml:space="preserve"
     style="font-size:16px;fill:#ff0000;stroke:#ff0024;stroke-width:56.1227;stroke-linecap:square"
     x="-245.61072"
     y="703.15588"
     id="text379-0-7-6-9"
     transform="rotate(-90)"><tspan
       id="tspan379-4-1-0-6"
       x="-245.61072"
       y="703.15588"
       style="font-size:16px;fill:#000000;fill-opacity:1;stroke:none">⭠</tspan></text>
  <text
     xml:space="preserve"
     style="font-size:16px;fill:#ff0000;stroke:#ff0024;stroke-width:56.1227;stroke-linecap:square"
     x="-776.82373"
     y="-229.04764"
     id="text379-0-7-6-9-0"
     transform="scale(-1)"><tspan
       id="tspan379-4-1-0-6-2"
       x="-776.82373"
       y="-229.04764"
       style="font-size:16px;fill:#000000;fill-opacity:1;stroke:none">⭠</tspan></text>
</svg>`
    this._highlights = {}
  }

  getKey (name) {
    return this.shadowRoot.querySelector(`#key-${name}`)
  }

  highlightKey (name, color) {
    const key = this.getKey(name)
    if (!key) return
    const inner = key.querySelector('rect:last-of-type')
    if (!inner) return
    this._highlights[name] = inner.getAttribute('fill')
    inner.setAttribute('fill', color)
  }

  clearHighlight (name) {
    const key = this.getKey(name)
    if (!key) return
    const inner = key.querySelector('rect:last-of-type')
    if (!inner || !this._highlights[name]) return
    inner.setAttribute('fill', this._highlights[name])
    delete this._highlights[name]
  }

  clearAllHighlights () {
    Object.keys(this._highlights).forEach(name => this.clearHighlight(name))
  }
}

window.customElements.define('key-board', KeyBoard)
