const { REACT_APP_API_URL } = process.env;
export interface Response {
    count: {
        count_type: string;
        count_direction: string;
        count: number;
        time: any;
        intersection_id: number;
    };
}

const APIDomain = REACT_APP_API_URL;

const countTime = async (): Promise<Response> => {
    const url = `\\${APIDomain}/api/count`;
    //GET Request
    const settings = {
        method: 'GET',
        headers: {},
    };

    const response = await fetch(url, settings);
    const data = (await response.json()) as Response; 
    return data;
}

export default countTime;
/*
    class Count(models.Model):
    count_type = models.CharField(max_length=5, null=True)
    count_direction = models.CharField(max_length=2, null=True)
    count = models.IntegerField(null=True)
    time = models.DateTimeField(auto_now_add=True, null=True)
    intersection_id = models.ForeignKey(Intersection, related_name='counts', on_delete=models.CASCADE, null=True)

*/