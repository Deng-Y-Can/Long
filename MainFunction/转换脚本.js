const fs = require('fs');
const path = require('path');

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
    importance: '重要性'
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

function transformFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        const transformed = transformFieldNames(data);
        const output = JSON.stringify(transformed, null, 2);
        fs.writeFileSync(filePath, output, 'utf8');
        console.log(`✓ 已转换: ${filePath}`);
    } catch (error) {
        console.error(`✗ 转换失败: ${filePath}`, error.message);
    }
}

const dataDir = path.join(__dirname, '学科学习');
const files = [
    '历史数据.json',
    '物理数据.json', 
    '化学数据.json',
    '数学数据.json',
    '生物数据.json',
    '地理数据.json'
];

console.log('开始转换数据文件字段名...\n');
files.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
        transformFile(filePath);
    } else {
        console.log(`✗ 文件不存在: ${filePath}`);
    }
});
console.log('\n转换完成！');