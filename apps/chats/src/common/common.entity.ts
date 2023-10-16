import { instanceToPlain } from 'class-transformer';

export class CommonEntity {
    // ...

   /**
   * You need to override this function to customize the json output of class-transformer library
   * @returns 
   */
  toJSON(): any {
    const record = instanceToPlain(this);

    // Remove all double underscores `__` from all properties when serializing object
    const cleanUnderscoresProperties = (obj: object): void => {
      for (const [key, val] of Object.entries(obj)) {
        if (key.startsWith('__') && key.endsWith('__')) {
          const newKey = key.substring(2, key.length - 2)
          obj[newKey] = obj[key];
          delete obj[key];
        } else if (typeof val === "object") {
          if (val != null) {
            cleanUnderscoresProperties(val);
          }
        }
      }
    };

    if (record != null) {
      cleanUnderscoresProperties(record);
    }
    
    return record;
  }
}