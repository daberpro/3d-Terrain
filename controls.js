import * as THREE from 'three'

export const pointerLock = (THREEPointerLockControls,speed)=>{

    const key = new Map();
    key.set('w',false);
    key.set('s',false);
    key.set('a',false);
    key.set('d',false);

    window.onkeydown = d =>{
        if(d.key === 'q') THREEPointerLockControls.lock();
        if(d.key === 'Escape') THREEPointerLockControls.unlock();
        if(d.key === 'w') key.set(d.key,true);
        if(d.key === 's') key.set(d.key,true);
        if(d.key === 'd') key.set(d.key,true);
        if(d.key === 'a') key.set(d.key,true);
    }

    window.onkeyup = d =>{
        if(d.key === 'w') key.set(d.key,false);
        if(d.key === 's') key.set(d.key,false);
        if(d.key === 'd') key.set(d.key,false);
        if(d.key === 'a') key.set(d.key,false);
    }

    return {
        update(){
            if(key.get('w')){
                THREEPointerLockControls.moveForward(speed);
            }
            if(key.get('s')){
                THREEPointerLockControls.moveForward(-speed);
            }
            if(key.get('a')){
                THREEPointerLockControls.moveRight(-speed);
            }
            if(key.get('d')){
                THREEPointerLockControls.moveRight(speed);
            }
        }
    }

}

export const onlyMoveXZ = (Mesh,speed,Camera)=>{

    const key = new Map();
    key.set('w',false);
    key.set('s',false);
    key.set('a',false);
    key.set('d',false);

    window.onkeydown = d =>{
        if(d.key === 'w') key.set(d.key,true);
        if(d.key === 's') key.set(d.key,true);
        if(d.key === 'd') key.set(d.key,true);
        if(d.key === 'a') key.set(d.key,true);
    }

    window.onkeyup = d =>{
        if(d.key === 'w') key.set(d.key,false);
        if(d.key === 's') key.set(d.key,false);
        if(d.key === 'd') key.set(d.key,false);
        if(d.key === 'a') key.set(d.key,false);
    }

    return {
        update(){
            
            // Camera.position.copy(new THREE.Vector3(Mesh.position))
            // Camera.lookAt(new THREE.Vector3(Mesh.position));
            if(key.get('w')){
                Mesh.position.z -= speed;
            }
            if(key.get('s')){
                Mesh.position.z += speed;
            }
            if(key.get('a')){
                Mesh.position.x -= speed;
            }
            if(key.get('d')){
                Mesh.position.x += speed;
            }
        }
    }

}