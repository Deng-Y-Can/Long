const fieldMapping = {
    education_level: '教育水平',
    region: '地区',
    event: '事件',
    significance: '意义',
    additional_info: '附加信息',
    time: '时间',
    
    term: '术语',
    definition: '定义',
    level: '难度等级',
    formula: '公式',
    explanation: '解释',
    meaning: '含义',
    
    number: '原子序数',
    symbol: '元素符号',
    name: '元素名称',
    weight: '相对原子质量',
    category: '类别代码',
    categoryName: '类别名称',
    electrons: '电子排布',
    density: '密度',
    melting: '熔点',
    boiling: '沸点',
    electronegativity: '电负性',
    radius: '原子半径',
    year: '发现年份',
    physical: '物理性质',
    chemical: '化学性质',
    uses: '用途',
    
    def: '定义',
    importance: '重要性',
    
    类别: '类别',
    名称: '名称',
    表达式: '表达式',
    描述: '描述',
    适用范围: '适用范围'
};

function transformFieldNames(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => transformFieldNames(item));
    }
    
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        const newKey = fieldMapping[key] || key;
        result[newKey] = transformFieldNames(value);
    }
    return result;
}

function transformJsonFile(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        const transformed = transformFieldNames(data);
        return JSON.stringify(transformed, null, 2);
    } catch (error) {
        console.error('JSON转换错误:', error);
        return jsonString;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fieldMapping,
        transformFieldNames,
        transformJsonFile
    };
}