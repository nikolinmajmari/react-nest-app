
export interface IStopWatchProps{
  interval:number,
}

export default class StopWatch {
  private interval:number;
  private status:"paused"|"stopped"|"running"|"idle";
  private duration:number;
  private globalTimer:any;
  private timeoutInterval:any;
  private listeners:((interval:number)=>void)[];
  constructor(props:IStopWatchProps) {
    this.interval = props.interval;
    this.status = "idle";
    this.duration = 0;
    this.listeners = [];
  }

  _increment(){
    console.log('incrementing');
    this.duration += this.interval;
    this.globalTimer = Date.now();
    this.watch();
  }

  addIntervalListener(callback: (interval:number)=>void): void {
    this.listeners.push(callback);
  }
  watch() {
      for(const listener of this.listeners){
       setTimeout(()=> listener(this.duration));
      }
  }
  removeListener(callback: (interval:number)=>void): void {
     this.listeners = this.listeners.filter(
       (l)=>l!==callback
     );
  }

  getDuration(){
    return this.duration;
  }

  start(){
    if(this.status!=='running'){
      this.status = "running";
      this.timeoutInterval = setInterval(
        ()=>this._increment(),
        this.interval,
      )
      this.watch();
    }
  }

  stop(){
    this.status = "stopped";
    if(this.timeoutInterval){
      clearInterval(this.timeoutInterval);
      this.duration+=Date.now() - this.globalTimer;
    }
    this.watch();
  }

  pause(){
    this.status = "paused";
    if(this.timeoutInterval){
      clearInterval(this.timeoutInterval);
      this.duration+=Date.now() - this.globalTimer;
    }
    this.watch();
  }

  reset(){
    this.status = "idle";
    clearInterval(this.timeoutInterval);
    this.duration = 0;
  }


}
