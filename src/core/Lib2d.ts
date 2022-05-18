
export const loadImage = (src:any) => {
    let imga = new Image();
    if(src.indexOf("data:image") > -1){
        imga.src = src;
    }
    return imga;
}

export const reversed = (array:any) => {
    let arr = [];
    for(let i = (array.length-1); i > -1;i--){
        arr.push(array[i])
    }
    return arr;
}

export class MoveDirection {
    directionY:number;
    directionX:number;
    adjustmentX:number=0;
    adjustmentY:number=0;
    complete:boolean =false;
    currentCords:{x:number,y:number};
    constructor(
      public size:number,
      public startCords:{x:number,y:number},
      public endCords:{x:number,y:number}
    ){   
        this.currentCords = {...startCords};
        let directionY = this.endCords.y - this.currentCords.y;
        let directionX = this.endCords.x - this.currentCords.x;
        if(directionX === 0){
            this.adjustmentX = (this.size/2) * -1;
        }
        else if(directionX < 0){
            this.adjustmentX = this.size * -1;
        }
            
        if(directionY === 0){
            this.adjustmentY = (this.size/2) * -1;
        }
        else if(directionY < 0){
            this.adjustmentY = this.size * -1;
        }
     }
  
    update(): {x:number, y:number} {
        // if we are within one final push, then dont keep recalcualting, just go straight.
        let directionY = this.endCords.y - this.currentCords.y;
        let directionX = this.endCords.x - this.currentCords.x;
        if( isDiffLessThan(directionY,this.size) && isDiffLessThan(directionX,this.size)){
            this.completeMove();
        } else {
            // Normalize the direction
            var len = Math.sqrt(directionX * directionX + directionY * directionY);
            directionX /= len;
            directionY /= len;
            this.directionY = directionY;
            this.directionX = directionX;
            this.currentCords = {   x: this.currentCords.x + (this.directionX * this.size),
                                    y: this.currentCords.y + (this.directionY * this.size)};
        }
        return {x:this.currentCords.x + this.adjustmentX, y:this.currentCords.y + this.adjustmentY};
    }

    isComplete():boolean {
        return this.complete;
    }

    completeMove() {
        this.complete = true;
    }

  }

  /**
   * checks if the postive difference between number value is less than the shouldBeLessThan value.
   * @param value
   * @param shouldBeLessThan
   * @returns
   */
    export const isDiffLessThan = (value: number, shouldBeLessThan:number) => {
        if(value < 0){
            value = value*-1;
        }
        return value < shouldBeLessThan;
    }