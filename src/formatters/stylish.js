const signOfValue = {
  unchanged: '  ',
  deleted: '- ',
  added: '+ ',
};

const beginSymbol = '{';

const endSymbol = '}';

const firstTab = '  ';

const relativeTabForChild = `${firstTab.repeat(2)}`;

const relativeTabForEndSymbol = signOfValue.unchanged;

const formStringFromObject = (key, value, tab, sign) => `${tab}${sign}${key}: ${value}`;

const addElemInResultArr = (elem, tab) => {
  const elemInfo = [];
  const { name, value, status } = elem;
  const child = value[0];
  if (child instanceof Object) {
    elemInfo.push(formStringFromObject(name, beginSymbol, tab, signOfValue[status]));
    // eslint-disable-next-line no-use-before-define
    elemInfo.push(formatDiff(value, `${tab}${relativeTabForChild}`));
    elemInfo.push(`${tab}${relativeTabForEndSymbol}${endSymbol}`);
    return elemInfo.join('\n');
  }
  elemInfo.push(`${formStringFromObject(name, child, tab, signOfValue[status])}`);
  return elemInfo.join('\n');
};

const formatDiff = (diff, tab) => {
  const formattedDiff = diff.map((elem) => addElemInResultArr(elem, tab));
  return formattedDiff.join('\n');
};

const makeStylishFormat = (diff) => {
  const StylishFormattedResult = [beginSymbol];
  const formattedDiff = formatDiff(diff, firstTab);
  StylishFormattedResult.push(formattedDiff);
  StylishFormattedResult.push(endSymbol);
  return StylishFormattedResult.join('\n');
};

export default makeStylishFormat;
