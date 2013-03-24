<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>HTML Generator</title>
	<link rel="stylesheet" href="css/root.css"/>
	<link rel="stylesheet" href="css/index.css"/>
	<link rel="stylesheet" href="css/shCoreDefault.css"/>
</head>
<body>
	<div class="wrapper">
		<!-- H1 -->
		<h1><span>HTML Generator</span></h1>
		<!-- /H1 -->
		
		<!-- Step 01 -->
		<h2><span>Step 1: Upload a CSV file</span></h2>
		<div id="step01" class="step">
			<form id="form01" action="php/controller/render.php" method="post" enctype="multipart/form-data">
				<input type="file" name="csv" value="Select a file" />
				<input type="submit" value="submit"/>
			</form>
		</div>
		<!-- /Step 01 -->
		
		<!-- Step 02 -->
		<h2><span>Step 2: Set the file path and name</span></h2>
		<div id="step02-info" class="clearfix">
			<div class="left">
				<p class="notice">Notice: Select a column of the table as the file path and name.</p>
				<p id="csv-table-info"></p>
			</div>
			<div class="right">
				<p>Select a column:</p>
				<select id="select-file-name">
					<option value="defalut">Please select one</option>
				</select>
			</div>
		</div>
		<div id="step02" class="step">
			<table id="csv-table"></table>
			<p class="error"></p>
		</div>
		<!-- /Step 02 -->
		
		<!-- Step 03 -->
		<h2><span>Step 3: Upload a html template file</span></h2>
		<div id="step03" class="step">
			<form id="form02" action="php/controller/render.php" method="post" enctype="multipart/form-data">
				<input type="file" name="html" />
				<input type="submit" value="submit"/>
			</form>
			<pre id="form02-output" class="brush: html;"></pre>
		</div>
		<!-- /Step 03 -->
		
		<!-- Step 04 -->
		<h2><span>Step 4: Generate the HTML files </span></h2>
		<div id="step04" class="step">
			<form id="generate" action="php/controller/render.php" >
				<input type="submit" value="Generate"/>
			</form>
		</div>
		<div class="modal">
			<div class="grey-bg"></div>
			<div class="modal-window">
				<h3>Report</h3>
				<table id="report"></table>
				<a id="link" href="">Please download the <span></span> file.</a>
			</div>
		</div>
		<!-- /Step 04 -->
		
	</div>
	
	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/shCore.js"></script>
	<script type="text/javascript" src="js/shBrushXml.js"></script>
	<script type="text/javascript" src="js/index.js"></script>
</body>
</html>