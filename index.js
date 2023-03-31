let express = require(`express`);
let app = express();
let port = 3000;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})

// Раздача статики
app.use(express.static(`public`));

// Настройка чтения тела запроса
app.use(express.urlencoded({ extended: true }))

// Настройка handlebars
let hbs = require('hbs');
app.set('views', 'views');
app.set('view engine', 'hbs');

// Настройка БД
let mongoose = require(`mongoose`);
mongoose.connect(`mongodb://127.0.0.1:27017/fake-shop`)

let schema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    isOnSale: Boolean,
    category: String,
    likes: Number,
});
// Схема, показывает конструкцию БД, т.е. что там хранится и какие типы данных используются

let Product = mongoose.model('product', schema);

// Роуты
// основная страница
app.get(`/`, async function(req, res) {
    let data = await Product.find();

    res.render(`index`, {
        array: data,
    });

});

// поиск по категориям
app.get('/category', async function(req, res) {
    let name = req.query.name;
    let data = await Product.find({category: name});

    res.render(`index`, {
        array: data,
    });

});

// супер цена
app.get('/discount', async function(req, res) {
    let data = await Product.find({isOnSale: true})
    .sort({price: 1})
    .limit(10);

    res.render('index', {
        array: data
    });
});

app.get('/product', async function(req, res) {
    let id = req.query.id;
    let data = await Product.findOne({_id: id});

    if(data) {
        res.render('product', data);
    } else {
        res.render('404');
    }

});