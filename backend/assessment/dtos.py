from pydantic import BaseModel

class userRecordSchema(BaseModel):
    totalAssesment : int
    totalUser : int
    vataDominatUser : int
    pitaDominatUser : int
    kaphDominatUser : int