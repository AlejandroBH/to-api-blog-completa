function parseAndFilter(queryString, data, textFields = []) {
  if (!queryString || !data) return data || [];

  const tokens = queryString.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

  return data.filter(item => {
    return tokens.every(token => {
      const cleanToken = token.replace(/"/g, '');

      const colonIndex = cleanToken.indexOf(':');

      if (colonIndex > 0) {
        const field = cleanToken.substring(0, colonIndex);
        const valueExpr = cleanToken.substring(colonIndex + 1);

        let operator = '=';
        let value = valueExpr;

        if (valueExpr.startsWith('>=')) {
          operator = '>=';
          value = valueExpr.substring(2);
        } else if (valueExpr.startsWith('>')) {
          operator = '>';
          value = valueExpr.substring(1);
        } else if (valueExpr.startsWith('<=')) {
          operator = '<=';
          value = valueExpr.substring(2);
        } else if (valueExpr.startsWith('<')) {
          operator = '<';
          value = valueExpr.substring(1);
        }

        const itemValue = item[field];

        if (itemValue === undefined) return false;

        return compareValues(itemValue, value, operator);
      } else {
        const searchTerm = cleanToken.toLowerCase();
        return textFields.some(field => {
          const val = item[field];
          return val && String(val).toLowerCase().includes(searchTerm);
        });
      }
    });
  });
}

function compareValues(itemValue, queryValue, operator) {
  const numItem = Number(itemValue);
  const numQuery = Number(queryValue);

  const isNum = !isNaN(numItem) && !isNaN(numQuery);
  const valA = isNum ? numItem : itemValue;
  const valB = isNum ? numQuery : queryValue;

  if (!isNum && isValidDate(itemValue) && isValidDate(queryValue)) {
    const dateA = new Date(itemValue).getTime();
    const dateB = new Date(queryValue).getTime();
    switch (operator) {
      case '>': return dateA > dateB;
      case '>=': return dateA >= dateB;
      case '<': return dateA < dateB;
      case '<=': return dateA <= dateB;
      case '=': return dateA === dateB;
      default: return false;
    }
  }

  switch (operator) {
    case '>': return valA > valB;
    case '>=': return valA >= valB;
    case '<': return valA < valB;
    case '<=': return valA <= valB;
    case '=': return String(valA).toLowerCase() === String(valB).toLowerCase();
    default: return false;
  }
}

function isValidDate(dateString) {
  return !isNaN(Date.parse(dateString));
}

module.exports = { parseAndFilter };
