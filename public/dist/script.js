var greeting, today = new Date,
    hourNow = today.getHours();
greeting = 18 < hourNow ? "GoodEvening!" : 12 < hourNow ? "Good Afternoon!" : 0 < hourNow ? "Good Morning!" : "Welcome!", document.write(`
<div class="container greeting-container">
<p class = "ml1">
        <span class = "text-wrapper">
        <span class = "letters" id="greeting" > ${greeting}
        </span> 
        </span> 
        </p>
        </div>
        `);