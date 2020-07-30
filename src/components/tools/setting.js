import { message } from 'ant-design-vue/es';
// import defaultSettings from '../defaultSettings';

let lessNodesAppended;

const colorList = [
  {
    key: '薄暮', color: '#F5222D',
  },
  {
    key: '火山', color: '#FA541C',
  },
  {
    key: '日が暮れる', color: '#FAAD14',
  },
  {
    key: '明るい青', color: '#13C2C2',
  },
  {
    key: 'オーロラ・グリーン', color: '#52C41A',
  },
  {
    key: '暁青（黙認）', color: '#1890FF',
  },
  {
    key: '極客藍', color: '#2F54EB',
  },
  {
    key: 'あー', color: '#722ED1',
  },
];

const updateTheme = primaryColor => {
  // Don't compile less in production!
  /* if (process.env.NODE_ENV === 'production') {
    return;
  } */
  // Determine if the component is remounted
  if (!primaryColor) {
    return;
  }
  const hideMessage = message.loading('引数をコンパイル中！', 0);
  console.info(`引数をコンパイル中!`)
  function buildIt() {
    // lessが既にロードされているかどうかを正しく判定します。modifyVarsが利用できます
    if (!window.less || !window.less.modifyVars) {
      return;
    }
    // less.modifyVars使える
    window.less.modifyVars({
        '@primary-color': primaryColor,
      })
      .then(() => {
        hideMessage();
      })
      .catch(() => {
        message.error('Failed to update theme');
        hideMessage();
      });
  }
  if (!lessNodesAppended) {
    // insert less.js and color.less
    const lessStyleNode = document.createElement('link');
    const lessConfigNode = document.createElement('script');
    const lessScriptNode = document.createElement('script');
    lessStyleNode.setAttribute('rel', 'stylesheet/less');
    lessStyleNode.setAttribute('href', '/color.less');
    lessConfigNode.innerHTML = `
      window.less = {
        async: true,
        env: 'production',
        javascriptEnabled: true
      };
    `;
    lessScriptNode.src = 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js';
    lessScriptNode.async = true;
    lessScriptNode.onload = () => {
      buildIt();
      lessScriptNode.onload = null;
    };
    document.body.appendChild(lessStyleNode);
    document.body.appendChild(lessConfigNode);
    document.body.appendChild(lessScriptNode);
    lessNodesAppended = true;
  } else {
    buildIt();
  }
};

const updateColorWeak = colorWeak => {
  // document.body.className = colorWeak ? 'colorWeak' : '';
  colorWeak ? document.body.classList.add('colorWeak') : document.body.classList.remove('colorWeak')
};

export { updateTheme, colorList, updateColorWeak }