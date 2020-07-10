export class ScoreManager{

    readonly scoreValue = document.getElementById("GameScore") as HTMLTitleElement;
    readonly bestScoreValue = document.getElementById("BestScore") as HTMLTitleElement;
    readonly gameOverScore = document.getElementById("GameOverScore") as HTMLTitleElement;

    private score: number;
    private bestScore: number;

    constructor(){
        var bestScoreValue = this.AccessCookie("bestScore");

        if(bestScoreValue == ""){
            this.bestScore = 0;
            this.CreateCookie("bestScore", this.bestScore.toString(), 60);
        }else{
            this.bestScore = +bestScoreValue;
        }

        this.score = 0;
        this.UpdateBestScore(this.bestScore);
    }

    GetScore(): number{
        return this.score;
    }

    UpdateScore(scoreChange: number){
        this.score += scoreChange;

        this.scoreValue.innerText = this.score.toString();
        if(this.score > this.bestScore){
            this.bestScoreValue.innerText = this.score.toString();
        }
    }

    GameEnd(){
        this.gameOverScore.innerText = "Score: " + this.score;

        if(this.score <= this.bestScore){
            this.UpdateScore(-this.score);
            return;
        }

        this.UpdateBestScore(this.score);
        this.UpdateScore(-this.score);
    }

    UpdateBestScore(newBestScore: number){
        this.bestScore = newBestScore;
        this.bestScoreValue.innerText = this.bestScore.toString();

        this.CreateCookie("bestScore", this.bestScore.toString(), 60);
    }

    private AccessCookie(cookieName: string)
    {
        var name = cookieName + "=";
        var allCookieArray = document.cookie.split(';');
        for(let i = 0; i< allCookieArray.length; i++)
        {
            var temp = allCookieArray[i].trim();
            if (temp.indexOf(name)==0)
                return temp.substring(name.length,temp.length);
        }
        return "";
    }

    private CreateCookie(cookieName: string, cookieValue:string, daysToExpire: number)
    {
      var date = new Date();
      date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
      document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toDateString();
    }
}