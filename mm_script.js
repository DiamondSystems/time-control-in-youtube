// ==UserScript==
// @name EXT YouTube timer
// @author DiamondSystems
// @license GPLv3
// @version 1.001
// @include https://www.youtube.com/*
// @grant none
// ==/UserScript==

/**
 * ------------------------------------------
 * Settings
 * ------------------------------------------
 **/
let workingHours = {
    from: 6,
    to:   18
};
let dailyLimitInMinutes = 120;
let reminderIntervalInSeconds = 600;
let checkIntervalInSeconds = 10;


/**
 * ------------------------------------------
 * STOP! Everything else is a matrix ;)
 * ------------------------------------------
 **/
let intervalId;
if (confirm("You're not working?"))
{
    const date = new Date();
    const currentHour = date.getHours();

    let   isStop = localStorage.getItem('stop');
    if (isStop === null)
        isStop = 0;

    if ((currentHour >= workingHours.from && currentHour <= workingHours.to) || isStop > 0)
        stopYoutube();
    else
    {
        let dayId      = date.getMonth() + date.getDay();
        let savedDayId = localStorage.getItem('dayId');

        savedDayId = (savedDayId == null) ? 0 : parseInt(savedDayId);
        if (savedDayId !== dayId)
        {
            localStorage.setItem('dayId', dayId.toString());
            localStorage.setItem('timer', '0');
            localStorage.setItem('stop', '0');
        }

        let reminderInterval = 0;
        intervalId = setInterval(function()
        {
            let timer = localStorage.getItem('timer');
            timer = (timer === null) ? 0 : parseInt(timer);
            localStorage.setItem('timer', timer+checkIntervalInSeconds);
            reminderInterval += checkIntervalInSeconds;

            if (timer >= (dailyLimitInMinutes * 60))
            {
                localStorage.setItem('stop', '1');
                stopYoutube();
            }
            else if (reminderInterval >= reminderIntervalInSeconds)
            {
                reminderInterval = 0;

                pausePlayer();
                setTimeout(function()
                {
                    if (confirm('Maybe enough already?'))
                        stopYoutube();
                    else
                        setTimeout(pausePlayer,500);
                }, 500);
            }
        }, checkIntervalInSeconds * 1000);
    }
}

function pausePlayer()
{
    document.getElementsByClassName("html5-main-video")[0].click();
}

function stopYoutube()
{
    clearInterval(intervalId);

    document.body.style.background = '#181818';
    document.body.style.color = '#fff';
    document.body.style.fontSize = '60px';
    document.body.innerHTML = '<div style="text-align:center">:)</div>';

    setTimeout(function() {
        document.location.href = "https://www.google.com/search?q=motivation+to+work";
    }, 1000);
}