namespace MidSpace.Data.Interfaces
{
    public interface ISoftDelete : IEntity
    {
        bool IsDeleted { get; set; }
    }
}
