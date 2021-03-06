import Chimee from 'chimee';
import {isObject, isArray} from 'chimee-helper';
import chimeeControl from 'chimee-plugin-controlbar';
import chimeeCenterState from 'chimee-plugin-center-state';
import chimeeContextmenu from 'chimee-plugin-contextmenu';
import chimeeLog from 'chimee-plugin-log';
import chimeePluginPopupFactory from 'chimee-plugin-popup';
import chimeeKernelHls from 'chimee-kernel-hls';
import chimeeKernelFlv from 'chimee-kernel-flv';
import './index.css';

Chimee.install(chimeeControl);
Chimee.install(chimeeCenterState);
Chimee.install(chimeeContextmenu);
Chimee.install(chimeeLog);

class ChimeePlayer extends Chimee {
  constructor (config) {
    if(!isObject(config)) throw new TypeError('You must pass an Object as config when you new ChimeePlayer');

    // 添加UI插件
    config.plugin = config.plugin || config.plugins;
    if(!isArray(config.plugin)) config.plugin = [];
    const innerPlugins = [
      chimeeControl.name,
      chimeeCenterState.name,
      chimeeContextmenu.name,
      chimeeLog.name
    ];
    const configPluginNames = config.plugin.map(item => isObject(item) ? item.name : item);
    innerPlugins.forEach(name => {
      if(configPluginNames.indexOf(name) > -1) return;
      config.plugin.push(name);
    });

    // 添加解码器
    if(!isObject(config.preset)) {
      config.preset = {
        hls: chimeeKernelHls,
        flv: chimeeKernelFlv
      };
    }

    super(config);

    // 右键菜单的播放暂停
    this.on('play', () => this.chimeeContextmenu.updatemenu([{text: '暂停', action: 'pause'}]));
    this.on('pause', () => this.chimeeContextmenu.updatemenu([{text: '播放', action: 'play'}]));
  }
}
// 暴露浮层工厂方法
ChimeePlayer.popupFactory = chimeePluginPopupFactory;

export default ChimeePlayer;
