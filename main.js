function isComplete(edges, n) {
  degree = {};
  for (var i = 0; i < edges.length; i++) {
    var to = edges[i]['to'];
    var from = edges[i]['from'];
    if (degree[to] == null) {
      degree[to] = 1;
    } else {
      degree[to]++;
    }
    if (degree[from] == null) {
      degree[from] = 1;
    } else {
      degree[from]++;
    }
  }
  for (var i = 0; i < n; i++) {
    if (degree[i] != n-1) {
      return false;
    }
  }

  return edges.length == (n * (n - 1)) / 2;
}

function hasSelfLoop(edges) {
  for (var i = 0; i < edges.length; i++) {
    if (edges[i]['from'] == edges[i]['to']) {
      return true;
    }
  }
  return false;
}

function hasIsolatedVertex(edges, n) {
  var all = []
  for (var i = 0; i < edges.length; i++) {
    all.push(edges[i]['from']);
    all.push(edges[i]['to']);
  }
  all = Array.from(new Set(all));
  for (var i = 0; i < n; i++) {
    if (!all.includes(i)) {
      return true;
    }
  }
  return false;
}

function writeGraphInfo(graph, n, id) {
  var _isComplete = isComplete(graph[2], n);
  var _hasSelfLoop = hasSelfLoop(graph[2]);
  var _hasIsolatedVertex = hasIsolatedVertex(graph[2], n);
  var graphInfo = "Graph: " + (parseInt(id)+1) + "\nIs Complete: " + _isComplete + "\n Has Self Loop: " + _hasSelfLoop + "\n Has Isolated Vertex: " + _hasIsolatedVertex;
  var para = document.createElement('p');
  para.innerText = graphInfo;
  document.getElementById('graph-div').appendChild(para);
}

function drawGraph(graph, id) {
  var n = graph[0];
  var e = graph[1];
  var edges = new vis.DataSet(graph[2]);
  var nodes = []
  for (var i = 0; i < n; i++) {
    nodes.push({id: i, label: String(i)});
  } 
  nodes = new vis.DataSet(nodes);
  var container = document.createElement('div');
  container.setAttribute('id', 'graph-' + id)
  document.getElementById('graph-div').appendChild(container);
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {
    autoResize: true,
    height: '500%',
    width: '50%',
  }
  var network = new vis.Network(container, data, options);
}

function parseGraph(file) {
  file = file.split('\n');
  allGraphs = []
  for (var i = 0; i < file.length;) {
    graph = [0, 0, null]
    var n = parseInt(file[i]);
    if (n == 0) break;
    var e = parseInt(file[i+1]);
    graph[0] = n;
    graph[1] = e;
    edgesHash = [];
    for (var j = i + 2; j <= i + e + 1; j++) {
      var edge = file[j].split(' ');
      var x = parseInt(edge[0]);
      var y = parseInt(edge[1]);
      edgesHash.push({from: x, to: y});
    }
    graph[2] = edgesHash;
    allGraphs.push(graph);
    i += e + 2;
  }
  return allGraphs;
}

function readFileContent(file) {
	const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  });
}

function loadFile() {
  const input = event.target;
  if ('files' in input && input.files.length > 0) {
    file = input.files[0];
    readFileContent(file).then(content => {
      var graphs = parseGraph(content);
      for (var i = 0; i < graphs.length; i++) {
        writeGraphInfo(graphs[i], graphs[i][0], i);
        drawGraph(graphs[i], i);
      }
    }).catch(error => console.log(error));
  }
}

window.onload = () => {
  document.getElementById('input-file')
  .addEventListener('change', loadFile)
}