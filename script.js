// Dados em memória
let tasks = {
    todo: [],
    progress: [],
    done: []
};
let transactions = [];
let notes = [];

// Atualizar tema baseado no horário
function updateTheme() {
    const hour = new Date().getHours();
    const body = document.getElementById('body');
    
    if (hour >= 6 && hour < 18) {
        body.className = 'theme-day';
    } else {
        body.className = 'theme-night';
    }
}

// Atualizar relógio
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR');
    const dateString = now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('time').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}

// Simular dados de clima (normalmente viria de uma API)
function updateWeather() {
    const temperatures = [22, 25, 28, 24, 21, 26, 23];
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const conditions = ['☀️', '⛅', '🌤️', '🌦️', '☀️', '⛅', '🌤️'];
    
    // Temperatura atual
    document.getElementById('temperature').textContent = `${temperatures[0]}°C`;

    // Previsão da semana
    const weekDiv = document.getElementById('weather-week');
    weekDiv.innerHTML = '';
    
    for (let i = 0; i < 7; i++) {
        weekDiv.innerHTML += `
            <div class="weather-day">
                <div>${days[i]}</div>
                <div style="font-size: 2em; margin: 10px 0;">${conditions[i]}</div>
                <div>${temperatures[i]}°C</div>
            </div>
        `;
    }
}

// Gerenciar abas
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Adicionar card/meta
function addCard(type) {
    const title = prompt('Título da meta:');
    if (!title) return;
    
    const description = prompt('Descrição (opcional):') || '';
    const dueDate = prompt('Data limite (DD/MM/AAAA):') || '';
    
    const card = {
        id: Date.now(),
        title,
        description,
        dueDate,
        type
    };
    
    tasks[type].push(card);
    renderCards();
}

// Renderizar cards
function renderCards() {
    ['todo', 'progress', 'done'].forEach(type => {
        const container = document.getElementById(`${type}-cards`);
        container.innerHTML = '';
        
        tasks[type].forEach(card => {
            container.innerHTML += `
                <div class="card" onclick="moveCard(${card.id}, '${type}')">
                    <div class="card-title">${card.title}</div>
                    ${card.dueDate ? `<div class="card-date">📅 ${card.dueDate}</div>` : ''}
                    ${card.description ? `<div class="card-description">${card.description}</div>` : ''}
                </div>
            `;
        });
    });
}

// Mover card entre colunas
function moveCard(cardId, currentType) {
    const types = ['todo', 'progress', 'done'];
    const currentIndex = types.indexOf(currentType);
    
    if (currentIndex < types.length - 1) {
        const nextType = types[currentIndex + 1];
        const cardIndex = tasks[currentType].findIndex(card => card.id === cardId);
        const card = tasks[currentType][cardIndex];
        
        tasks[currentType].splice(cardIndex, 1);
        card.type = nextType;
        tasks[nextType].push(card);
        
        renderCards();
    }
}

// Adicionar transação
function addTransaction() {
    const desc = document.getElementById('transacao-desc').value;
    const valor = parseFloat(document.getElementById('transacao-valor').value);
    const tipo = document.getElementById('transacao-tipo').value;
    
    if (!desc || !valor) return;
    
    transactions.push({
        id: Date.now(),
        description: desc,
        amount: valor,
        type: tipo,
        date: new Date().toLocaleDateString('pt-BR')
    });
    
    document.getElementById('transacao-desc').value = '';
    document.getElementById('transacao-valor').value = '';
    
    updateFinances();
}

// Atualizar finanças
function updateFinances() {
    let receitas = 0;
    let despesas = 0;
    
    transactions.forEach(t => {
        if (t.type === 'receita') {
            receitas += t.amount;
        } else {
            despesas += t.amount;
        }
    });
    
    const saldo = receitas - despesas;
    
    document.getElementById('receitas').textContent = `R$ ${receitas.toFixed(2).replace('.', ',')}`;
    document.getElementById('despesas').textContent = `R$ ${despesas.toFixed(2).replace('.', ',')}`;
    document.getElementById('saldo').textContent = `R$ ${saldo.toFixed(2).replace('.', ',')}`;
    document.getElementById('saldo').className = `finance-amount ${saldo >= 0 ? 'positive' : 'negative'}`;
    
    // Renderizar lista de transações
    const list = document.getElementById('transacoes-list');
    list.innerHTML = '<h3>📋 Transações Recentes</h3>';
    
    transactions.slice(-5).reverse().forEach(t => {
        list.innerHTML += `
            <div class="card">
                <div class="card-title">${t.description}</div>
                <div class="card-date">${t.date}</div>
                <div class="card-description ${t.type === 'receita' ? 'positive' : 'negative'}">
                    ${t.type === 'receita' ? '+' : '-'} R$ ${t.amount.toFixed(2).replace('.', ',')}
                </div>
            </div>
        `;
    });
}

// Adicionar nota
function addNote() {
    const titulo = document.getElementById('nota-titulo').value;
    const conteudo = document.getElementById('nota-conteudo').value;
    
    if (!titulo || !conteudo) return;
    
    notes.push({
        id: Date.now(),
        title: titulo,
        content: conteudo,
        date: new Date().toLocaleDateString('pt-BR')
    });
    
    document.getElementById('nota-titulo').value = '';
    document.getElementById('nota-conteudo').value = '';
    
    renderNotes();
}

// Renderizar notas
function renderNotes() {
    const list = document.getElementById('notas-list');
    list.innerHTML = '';
    
    notes.forEach(note => {
        list.innerHTML += `
            <div class="card">
                <div class="card-title">${note.title}</div>
                <div class="card-date">${note.date}</div>
                <div class="card-description">${note.content}</div>
            </div>
        `;
    });
}

// Inicializar aplicação
function init() {
    updateTheme();
    updateTime();
    updateWeather();
    renderCards();
    updateFinances();
    renderNotes();
}

// Atualizar a cada segundo
setInterval(() => {
    updateTime();
    updateTheme();
}, 1000);

// Inicializar quando a página carregar
window.onload = init;
