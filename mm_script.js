// ==UserScript==
// @name EXT YouTube timer
// @author DiamondSystems
// @license GPLv3
// @version 1.005
// @include https://www.youtube.com/*
// @grant none
// @run-at document-start
// ==/UserScript==

/**
 * ------------------------------------------
 * Settings
 * ------------------------------------------
 **/
const workingHours = {
    from: 6,
    to:   18
};
const dailyLimitInMinutes = 120;
const reminderIntervalInSeconds = 600;
const checkIntervalInSeconds = 10;
const redirectUrl = "https://www.google.com/search?q=motivation+to+work";


/**
 * ------------------------------------------
 * STOP! Everything else is a matrix ;)
 * ------------------------------------------
 **/
const extYT = extYT ||
{
    extYoutubeTimer: function()
    {
        if (! confirm("You're not working?"))
            return;

        let isStop = localStorage.getItem('stop');
        if (isStop === null)
            isStop = 0;

        if ((extYT.currentHour >= workingHours.from && extYT.currentHour <= workingHours.to) || isStop > 0)
            extYT.stopYoutube();
        else
        {
            let dayId      = extYT.date.getMonth() + extYT.date.getDay();
            let savedDayId = localStorage.getItem('dayId');

            savedDayId = (savedDayId == null) ? 0 : parseInt(savedDayId);
            if (savedDayId !== dayId)
            {
                localStorage.setItem('dayId', dayId.toString());
                localStorage.setItem('timer', '0');
                localStorage.setItem('stop', '0');
            }

            const currentUrl = document.location.href;
            let reminderInterval = 0;
            let intervalId = setInterval(function()
            {
                if (document.hidden)
                    return;

                let timer = localStorage.getItem('timer');
                timer = (timer === null) ? 0 : parseInt(timer);
                localStorage.setItem('timer', timer+checkIntervalInSeconds);
                reminderInterval += checkIntervalInSeconds;

                if (timer >= (dailyLimitInMinutes * 60))
                {
                    localStorage.setItem('stop', '1');
                    clearInterval(intervalId);
                    extYT.stopYoutube();
                }
                else if (reminderInterval >= reminderIntervalInSeconds)
                {
                    reminderInterval = 0;

                    extYT.pausePlayer();
                    setTimeout(function()
                    {
                        if (confirm('Maybe enough already?'))
                        {
                            clearInterval(intervalId);
                            extYT.stopYoutube();
                        }
                        else
                            setTimeout(extYT.pausePlayer,500);
                    }, 500);
                }
                else if (currentUrl !== document.location.href)
                {
                    clearInterval(intervalId);
                    extYT.extYoutubeTimer();
                }
            }, checkIntervalInSeconds * 1000);
        }
    },

    stopYoutube: function()
    {
        if (document.body !== null)
        {
            document.body.style.background = '#181818';
            document.body.style.color = '#fff';
            document.body.style.fontSize = '60px';
            document.body.innerHTML = '<div style="text-align:center">:)</div>';

            setTimeout(extYT.redirectFromYoutube, 1000);
        }
        else
            extYT.redirectFromYoutube();
    },

    pausePlayer: function()
    {
        document.getElementsByClassName("html5-main-video")[0].click();
    },

    redirectFromYoutube: function()
    {
        document.location.href = redirectUrl;
    },

    init: function()
    {
        this.date = new Date();
        this.currentHour = this.date.getHours();
        this.extYoutubeTimer();
    }
};
extYT.init();