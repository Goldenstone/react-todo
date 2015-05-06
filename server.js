/**
 * This file provided by Facebook is for non-commercial testing and evaluation purposes only.
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/todos.json', function(req, res) {
  fs.readFile('todos.json', function(err, data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.post('/todos.json', function(req, res) {
  fs.readFile('todos.json', function(err, data) {
    var todos = JSON.parse(data);
    if (req.body.completed === "false") {
      req.body.completed = false;
    } else {
      req.body.completed = true;
    }
    todos.push(req.body);
    fs.writeFile('todos.json', JSON.stringify(todos, null, 4), function(err) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(JSON.stringify(todos));
    });
  });
});

app.put('/todos.json', function(req, res) {
  fs.readFile('todos.json', function(err, data) {
    var todos = JSON.parse(data);
    todos.forEach(function(todo) {
      if (todo.key === req.body.todoId) {
        todo.completed = !todo.completed;
      }
    });
    fs.writeFile('todos.json', JSON.stringify(todos, null, 4), function(err) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(JSON.stringify(todos));
    });
  });
});

app.delete('/todos.json', function(req, res) {
  fs.readFile('todos.json', function(err, data) {
    var todos = JSON.parse(data);
    todos.forEach(function(todo, index) {
      if (todo.key === req.body.todoId) {
        todos.splice(index, 1);
      }
    });
    fs.writeFile('todos.json', JSON.stringify(todos, null, 4), function(err) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(JSON.stringify(todos));
    });
  });
});
app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
