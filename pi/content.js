class PgInstaller {
  constructor() {
    console.log("输入pi('xxx')自动查找并为当前网页引入对应包的cdn进行测试，如pi('lodash.js')");
    this.packages = [];
    this.cdnfetchs = [
      this.cdnjsfetch,
      this.jsdelivrfetch,
    ];
  }

  add = async (packageName) => {
    try {
      console.log(`加载${packageName}中————`);
      const packageRes = await this.startfetch(packageName);
      const scrpitElm = document.createElement("script");
      scrpitElm.src = packageRes.src;
      scrpitElm.onload = () => {
        console.log(`从${packageRes.cdn}完成对${packageRes.packageName}${packageRes.version ? `@${packageRes.version}` : ''}的加载`);
        this.packages.push(packageRes.packageName);
        console.log(`目前已安装${this.packages}`);
      };
      document.body.appendChild(scrpitElm);
    } catch (error) {
      console.log(`${packageName}不存在，可尝试更换名称如增加.js后缀`);
    }
  };

  async cdnjsfetch(packageName) {
    const res = await fetch(`https://api.cdnjs.com/libraries/${packageName}`)
      .then(res => res.json());
    if (!res.error) return {
      src: res.latest,
      version: res.version,
      packageName,
      cdn: 'cdnjs'
    };
    throw new Error();
  };

  async jsdelivrfetch(packageName) {
    const res = await fetch(`https://cdn.jsdelivr.net/npm/${packageName}`)
      .then(res => res.json());
    if (!res.error) return {
      src: res,
      packageName,
      cdn: 'jsdelivr'
    };
    throw new Error();
  };

  async startfetch(packageName) {
    for (const fetchFunc of this.cdnfetchs) {
      try {
        return await fetchFunc(packageName);
      } catch (error) {
        console.log(`${fetchFunc.name}请求失败`);
      }
    }
    throw new Error("所有请求失败");
  }
}

const pi = new PgInstaller().add;
