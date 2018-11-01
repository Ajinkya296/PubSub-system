
arr = [1,2,3,4]
function processJob()
{

	if(arr==[])
		return
	for(i = 0 ; i < arr.length ; i++)
	{
		console.log(i+"Done")
	}
}

function main()
{
	setInterval(processJob,3000)
}
main()